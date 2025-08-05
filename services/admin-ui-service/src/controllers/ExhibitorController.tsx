import { UserRepository } from '../repository/UserRepository';
import { ExhibitorData, ExhibitorFilter, ExhibitorStats } from '@/types/exhibitor.type';
import { User, UserType } from '@/types/user.type';

export class ExhibitorController {
  private static instance: ExhibitorController;
  private userRepository: UserRepository;

  private constructor() {
    this.userRepository = UserRepository.getInstance();
  }

  public static getInstance(): ExhibitorController {
    if (!ExhibitorController.instance) {
      ExhibitorController.instance = new ExhibitorController();
    }
    return ExhibitorController.instance;
  }

  async getAllExhibitors(): Promise<ExhibitorData[]> {
    try {
      const response = await this.userRepository.getUsers('EXHIBITOR');
      const exhibitors = response.data || [];
      
      // Transform the data
      return exhibitors.map(user => this.transformToExhibitorData(user));
    } catch (error) {
      console.error('Error fetching exhibitors:', error);
      throw error;
    }
  }

  async getExhibitorsByFilter(filter: ExhibitorFilter): Promise<ExhibitorData[]> {
    try {
      const allExhibitors = await this.getAllExhibitors();
      let filteredExhibitors = allExhibitors;

      if (filter.status) {
        filteredExhibitors = filteredExhibitors.filter(
          exhibitor => exhibitor.status === filter.status
        );
      }

      if (filter.booth_type) {
        filteredExhibitors = filteredExhibitors.filter(
          exhibitor => exhibitor.booth_type === filter.booth_type
        );
      }

      if (filter.verified !== undefined) {
        filteredExhibitors = filteredExhibitors.filter(
          exhibitor => exhibitor.verified === filter.verified
        );
      }

      if (filter.is_active !== undefined) {
        filteredExhibitors = filteredExhibitors.filter(
          exhibitor => exhibitor.is_active === filter.is_active
        );
      }

      if (filter.company) {
        filteredExhibitors = filteredExhibitors.filter(
          exhibitor => 
            exhibitor.company?.toLowerCase().includes(filter.company!.toLowerCase())
        );
      }

      return filteredExhibitors;
    } catch (error) {
      console.error('Error filtering exhibitors:', error);
      throw error;
    }
  }

  async getExhibitorStats(): Promise<ExhibitorStats> {
    try {
      const exhibitors = await this.getAllExhibitors();
      
      const stats: ExhibitorStats = {
        total: exhibitors.length,
        active: exhibitors.filter(e => e.is_active).length,
        inactive: exhibitors.filter(e => !e.is_active).length,
        verified: exhibitors.filter(e => e.verified).length,
        unverified: exhibitors.filter(e => !e.verified).length,
        with_booths: exhibitors.filter(e => e.booth_count && e.booth_count > 0).length,
        without_booths: exhibitors.filter(e => !e.booth_count || e.booth_count === 0).length,
      };

      return stats;
    } catch (error) {
      console.error('Error calculating exhibitor stats:', error);
      throw error;
    }
  }

  async updateExhibitor(exhibitorId: number, updates: Partial<ExhibitorData>): Promise<void> {
    try {
      // Convert ExhibitorData to User type for the update
      const userUpdates: Partial<User> = {
        user_id: exhibitorId,
        email: updates.email,
        phone: updates.phone,
        first_name: updates.first_name,
        last_name: updates.last_name,
        verified: updates.verified,
        is_active: updates.is_active,
        profile_pic: updates.profile_pic,
        gender: updates.gender,
        stripe_id: updates.stripe_id,
        payment_id: updates.payment_id,
        parent_exhibitor_id: updates.parent_exhibitor_id,
        // Exhibitor specific fields
        company: updates.company,
        rating: updates.rating,
        status: updates.status,
        pin_code: updates.pin_code,
        lat: updates.lat,
        lng: updates.lng,
      };
      
      await this.userRepository.updateUser(userUpdates);
    } catch (error) {
      console.error('Error updating exhibitor:', error);
      throw error;
    }
  }

  async getExhibitorById(exhibitorId: number): Promise<ExhibitorData | null> {
    try {
      const response = await this.userRepository.getUserById(exhibitorId);
      const user = response.data;
      
      if (user && user.user_type === UserType.Exhibitor) {
        return this.transformToExhibitorData(user);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching exhibitor by ID:', error);
      throw error;
    }
  }

  async exportExhibitors(): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
    try {
      const response = await this.userRepository.exportUsers('EXHIBITOR');
      if (response.data?.downloadUrl) {
        return {
          success: true,
          downloadUrl: response.data.downloadUrl
        };
      } else {
        return {
          success: false,
          error: response.message || 'Export failed'
        };
      }
    } catch (error) {
      console.error('Error exporting exhibitors:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  private transformToExhibitorData(user: any): ExhibitorData {
    return {
      user_id: user.user_id,
      email: user.email,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      verified: user.verified,
      is_active: user.is_active,
      profile_pic: user.profile_pic,
      gender: user.gender,
      stripe_id: user.stripe_id,
      payment_id: user.payment_id,
      parent_exhibitor_id: user.parent_exhibitor_id,
      two_factor_enabled: user.two_factor_enabled,
      
      // Exhibitor specific fields
      company: user.company,
      local: user.local,
      booth_preference: user.booth_preference,
      booth_type: user.booth_type,
      rating: user.rating,
      status: user.status,
      pin_code: user.pin_code,
      lat: user.lat,
      lng: user.lng,
      
      // Address information
      address: user.address || [],
      
      // Related data
      parentExhibitor: user.parentExhibitor ? this.transformToExhibitorData(user.parentExhibitor) : undefined,
      managedStaff: user.managedStaff ? user.managedStaff.map((staff: any) => this.transformToExhibitorData(staff)) : [],
      
      // Computed fields
      full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A',
      registration_date: user.created_at || 'N/A',
      booth_count: 0, // This would need to be calculated from booth service
    };
  }
} 