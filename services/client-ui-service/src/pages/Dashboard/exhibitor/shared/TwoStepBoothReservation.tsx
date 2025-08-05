import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Check, 
  AlertCircle,
  X,
  Loader2,
  FileText
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createBoothReservation as reserveBooths, selectLastCreatedReservation  } from '../../../../store/booth-slice';
import { PaymentController } from '@/controllers/PaymentController';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { useUser } from '@/context/UserContext';
import PaystackPaymentDialog from '@/components/payment/PaystackPaymentDialog';
import ToastNotification from '@/components/common/ToastNotification';
import InvoiceModal from '@/components/common/InvoiceModal';
import { 
  InvoiceData, 
  generateInvoiceNumber, 
  formatInvoiceDate, 
  calculateDueDate 
} from '../../../../utils/invoiceUtils';

import { INDOOR_PRICING, OUTDOOR_PRICING, PREMIUM_OUTDOOR_PRICING } from './components/BoothsData/pricingConfig';
import {Z_INDEX} from '../../../../utils/zIndexManager';
import { calculatePackagePrice } from '../../../../utils/priceCalculations';
import { sendInvoiceEmail } from '../../../../utils/invoiceEmailService';

interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  company?: string;
  ownerName?: string;
  sector?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  type?: string[];
}

// interface Profile extends Omit<PersonalInfo, 'address'> {
//   address?: {
//     street?: string;
//     city?: string;
//     state?: string;
//     postalCode?: string;
//     country?: string;
//   };
// }

interface SectorLayout {
  size: 'sm' | 'md' | 'lg';
}

interface BoothPrices {
  sm: number;
  md: number;
  lg: number;
}

interface TaxConfig {
  enabled: boolean;
  rate: number;
  label: string;
}

interface CurrencyConfig {
  showForeignCurrency: boolean;
  foreignCurrency: string;
  exchangeRates: {
    [key: string]: number;
  };
}

interface PaymentInfo {
  paymentMethod: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
  sameAsProfile: boolean;
}

// interface ReduxState {
//   userReducer: {
//     reservationIds: string[];
//     profile: Profile;
//     loading: boolean;
//     error: string | null;
//   };
// }

interface TwoStepBoothReservationProps {
    layoutData: {
    name: string;
    title: string;
    type: 'hall' | 'sector';
     boothTypes?: Array<{
      size: string;
      count: number;
      description: string;
      range: string;
    }>;
    color: string;
    boothCount: number;
    description: string;
    imageSrc: string;
    existingBooths?: { [key: string]: any };
    ratePerSqm: number;
  };
  show: boolean;
  onHide: () => void;
  selectedBooths: string[];
  personalInfo: PersonalInfo;
  sectorLayouts: { [key: string]: SectorLayout };
  BOOTH_PRICES: BoothPrices;
  isReservedByCurrentUser: (boothId: string) => boolean;
  taxConfig: TaxConfig;
  currencyConfig: CurrencyConfig;
  onReservationComplete?: (response: any) => void;
  standalone?: boolean;
    totalAmount?: number;
  boothBreakdown?: any[];
}

type ToastType = 'success' | 'info' | 'error' | 'warning';

// Add these imports at the top

// Add these helper functions inside the component
const getLocationType = (locationName: string, booths: any[]): 'indoor' | 'outdoor' | 'premium-outdoor' => {
  const isHall = locationName.toLowerCase().includes('hall');
  const isSector = ['fda', 'hct', 'eei', 'cga', 'ta', 'rbf', 'cog', 'oth','publication','household','transport'].some(
    sector => locationName.toLowerCase().includes(sector.toLowerCase())
  );
  
  if (isHall) {
    return 'indoor';
  }
  
  if (isSector) {
    const hasPremium = booths.some(booth => booth.category === 'Premium');
    return hasPremium ? 'premium-outdoor' : 'outdoor';
  }
  
  return 'indoor';
};

const getEntitlements = (totalSqm: number, locationType: string, booths?: any[]) => {
  const actualLocationType = booths ? getLocationType(locationType, booths) : 'indoor';
  
  const pricingTable = 
    actualLocationType === 'indoor' ? INDOOR_PRICING :
    actualLocationType === 'premium-outdoor' ? PREMIUM_OUTDOOR_PRICING :
    OUTDOOR_PRICING;
  
  const pricing = pricingTable[totalSqm];
  if (!pricing) return null;

  if (locationType !== 'sector') {
    return {
      ...pricing,
      furniture: actualLocationType === 'indoor' ? (pricing as any).furniture : undefined
    };
  }
};
const TwoStepBoothReservation: React.FC<TwoStepBoothReservationProps> = ({ 
  layoutData,
  show, 
  onHide, 
  selectedBooths, 
  // personalInfo, 
  sectorLayouts, 
  BOOTH_PRICES, 
  isReservedByCurrentUser,
  taxConfig,
  currencyConfig,
   totalAmount,
  boothBreakdown,
  // onReservationComplete,
  // standalone = false
}) => {
  const dispatch = useDispatch();
  const lastTransaction = useSelector(selectLastCreatedReservation);
  // Get reservation IDs from Redux state
  const { reservationIds=[], loading, error } = useSelector((state: any) => state.booth || {});
  const { profile } = useSelector((state: any) => state.userReducer || {});
  const { user } = useUser();
  // const [paymentReference, setPaymentReference] = useState<string | null>(null);
  
  // State for two-step process
  const [currentStep, setCurrentStep] = useState<number>(1);
  // const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);
  // const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [remark, setRemark] = useState<string>('');
  const [paymentLoading, setLoading] = useState<boolean>(false);
  
  // Toast notification state
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<ToastType>('success');
  
  // Invoice state
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  
  // Payment form state
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: (typeof profile?.address === 'object' ? profile?.address?.street : profile?.address) || '',
    billingCity: profile?.address?.city || profile?.city || '',
    billingState: profile?.address?.state || profile?.state || '',
    billingPostalCode: profile?.address?.postalCode || profile?.postalCode || '',
    billingCountry: profile?.address?.country || profile?.country || '',
    sameAsProfile: true
  });
  
  // Form validation state
  const [validated, setValidated] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (show) {
      setCurrentStep(1);
      // setFormSubmitted(false);
      setReservationSuccess(false);
      // setPaymentSuccess(false);
      setRemark('');
      setValidated(false);
      setEmailSent(false);
      setPaymentInfo({
        paymentMethod: 'card',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        billingAddress: (typeof profile?.address === 'object' ? profile?.address?.street : profile?.address) || '',
        billingCity: profile?.address?.city || profile?.city || '',
        billingState: profile?.address?.state || profile?.state || '',
        billingPostalCode: profile?.address?.postalCode || profile?.postalCode || '',
        billingCountry: profile?.address?.country || profile?.country || '',
        sameAsProfile: true
      });
    }
  }, [show, user]);

  // Send invoice email when payment dialog opens (step 2)
  const [emailSent, setEmailSent] = useState<boolean>(false);
  
  useEffect(() => {
    if (currentStep === 2 && reservationSuccess && user?.email && !emailSent) {
      const sendInvoiceEmailAsync = async () => {
        try {
          const invoiceData = generateInvoiceData();
          await sendInvoiceEmail(invoiceData, user.email, {
            logo: "/images/litf_logo.png"
          });
          
          setEmailSent(true);
          setToastType('success');
          setToastMessage('Invoice has been sent to your email address.');
          setShowToast(true);
        } catch (error) {
          console.error('Failed to send invoice email:', error);
          setToastType('warning');
          setToastMessage('Invoice email could not be sent, but you can still view it here.');
          setShowToast(true);
        }
      };
      
      sendInvoiceEmailAsync();
    } else {
      console.log("Unable to send invoice email")
    }
  }, [currentStep, reservationSuccess, user?.email, emailSent]);
  
  // Calculate total price based on selected booths
 const calculateSubtotal = (): number => {
    if (totalAmount !== undefined) {
     const total = [...new Set(boothBreakdown?.map(item => item.packagePrice))];
     return total[0];
    }
    
    // Fallback to original calculation if not provided
    return selectedBooths.reduce((total, boothId) => {
      const [sector] = boothId.split('-');
      const size = sectorLayouts[sector]?.size || 'md';
      return total + BOOTH_PRICES[size];
    }, 0);
  };
  
  // Calculate tax
  // const calculateTax = (): number => {
  //   if (!taxConfig?.enabled) return 0;
  //   const taxRate = taxConfig.rate || 7.5;
  //   return calculateSubtotal() * (taxRate / 100);
  // };
  
  // Calculate total
  const calculateTotal = (): number => calculateSubtotal() + 2000;
  
  // Get booth size label
  // const getBoothSizeLabel = (size: string): string => {
  //   return size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large';
  // };
  
  // Format credit card number with spaces
  // const formatCardNumber = (input: string): string => {
  //   const digitsOnly = input.replace(/\D/g, '');
  //   const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
  //   return formatted.substring(0, 19);
  // };
  
  // Handle credit card number input with formatting
  // const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const formattedValue = formatCardNumber(e.target.value);
  //   setPaymentInfo(prev => ({
  //     ...prev,
  //     cardNumber: formattedValue
  //   }));
  // };
  
  // Format expiry date as MM/YY
  // const formatExpiryDate = (input: string): string => {
  //   const digitsOnly = input.replace(/\D/g, '');
  //   if (digitsOnly.length <= 2) {
  //     return digitsOnly;
  //   } else {
  //     return `${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2, 4)}`;
  //   }
  // };
  
  // Handle expiry date input with formatting
  // const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const formattedValue = formatExpiryDate(e.target.value);
  //   setPaymentInfo(prev => ({
  //     ...prev,
  //     expiryDate: formattedValue
  //   }));
  // };
  
  // Handle payment form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'sameAsProfile') {
      if (checked) {
        setPaymentInfo(prev => ({
                  ...prev,
                  sameAsProfile: true,
                  billingAddress: (typeof profile?.address === 'object' ? profile?.address?.street : profile?.address) || '',
                  billingCity: (typeof profile?.address === 'object' ? profile?.address?.city : undefined) || profile?.city || '',
                  billingState: (typeof profile?.address === 'object' ? profile?.address?.state : undefined) || profile?.state || '',
                  billingPostalCode: (typeof profile?.address === 'object' ? profile?.address?.postalCode : undefined) || profile?.postalCode || '',
                  billingCountry: (typeof profile?.address === 'object' ? profile?.address?.country : undefined) || profile?.country || ''
                }));
      } else {
        setPaymentInfo(prev => ({
          ...prev,
          sameAsProfile: false
        }));
      }
    } else {
      setPaymentInfo(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Generate invoice data
  const generateInvoiceData = (): InvoiceData => {
    const invoiceNumber = generateInvoiceNumber();
    const date = formatInvoiceDate();
    const dueDate = calculateDueDate();
    
    // Prepare invoice items from booth breakdown
    let items: any[] = [];
    let packagePrice = 0;
    if (boothBreakdown && boothBreakdown.length > 0) {
      // Use the new booth breakdown structure with package pricing
      boothBreakdown.forEach((breakdown: any) => {
        // Always use package pricing for invoice
         packagePrice = breakdown.packagePrice || 0;
        const totalSqm = breakdown.totalSqm || 0;
        const boothCount = breakdown.booths?.length || breakdown.boothIds?.length || 1;
        
        items.push({
          description: `Booth Package - ${breakdown.location} (${boothCount} booths, ${totalSqm}m²)`,
          quantity: 1,
          unitPrice: packagePrice,
          total: packagePrice,
          size: `${totalSqm}m² Package`,
          sector: breakdown.location
        });
      });
    } else {
      // Fallback to selected booths if no breakdown available
      items = selectedBooths.map(boothId => {
        const [sectorCode] = boothId.split('-');
        const size = sectorLayouts[sectorCode]?.size || 'md';
        const price = BOOTH_PRICES[size];
        
        // Map sector codes to full names
        const sectorNameMapping: Record<string, string> = {
          'AFRICAHALL': 'Africa Hall',
          'HALLA': 'Hall A', 
          'HALLB': 'Hall B',
          'INTERNATIONAL': 'International Hall',
          'FDA': 'Food, Drinks, Agriculture & Allied Products',
          'HCT': 'Household Cosmetics & Textile Products',
          'EEI': 'ICT & Electronics Products',
          'CGA': 'Corporate Organizations & Government Agencies',
          'TA': 'Transport and Allied/Power Products',
          'RBF': 'Real Estate, Building Furniture & Fittings',
          'COG': 'Conglomerate',
          'OTH': 'Publication, Healthcare & Sport Products',
          'COP': 'Commercial Premium'
        };
        
        const sectorName = sectorNameMapping[sectorCode] || sectorCode;
        
        return {
          description: `Booth ${boothId}`,
          quantity: 1,
          unitPrice: price,
          total: price,
          size: size.toUpperCase(),
          sector: sectorName
        };
      });
    }

    // Get customer information from both profile and user data
    const customerName = profile?.firstName || profile?.lastName || user?.firstName || user?.lastName || 'N/A';
    const customerCompany = profile?.company || profile?.ownerName || user?.company || '';
    const customerEmail = profile?.email || user?.email || '';
    const customerPhone = profile?.phoneNumber || profile?.phone || user?.phone || '';
    
    // Handle address data - profile might have nested address object
    const customerAddress = typeof profile?.address === 'object' ? profile?.address?.street : profile?.address || '';
    const customerCity = profile?.address?.city || profile?.city || '';
    const customerState = profile?.address?.state || profile?.state || '';
    const customerPostalCode = profile?.address?.postalCode || profile?.postalCode || '';
    const customerCountry = profile?.address?.country || profile?.country || '';

    // Use the totalAmount that was calculated and displayed in the UI
    // This ensures the invoice matches the reservation summary
    const subtotal = packagePrice;
    console.log("Subtotal: meeeeeee", items);
    // Calculate tax
    const tax = taxConfig?.enabled ? subtotal * ((taxConfig.rate || 7.5) / 100) : 0;
    
    // Calculate total
    const total = subtotal;

    console.log("Invoice Calculations:", {
      itemsCount: items.length,
      subtotal,
      tax,
      total,
      totalAmount,
      items,
      boothBreakdown
    });

    return {
      invoiceNumber,
      date,
      dueDate,
      customerInfo: {
        name: customerName,
        company: customerCompany,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        state: customerState,
        postalCode: customerPostalCode,
        country: customerCountry
      },
      items,
      subtotal,
      tax,
      total,
      currency: 'NGN',
      paymentMethod: paymentInfo.paymentMethod === 'card' ? 'Credit Card' : 
                     paymentInfo.paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash Payment',
      reservationIds: reservationIds,
      boothBreakdown: boothBreakdown || []
    };
  };

  // Handle invoice button click
  const handleInvoiceClick = () => {
    console.log("Booth Breakdown", boothBreakdown)
    const data = generateInvoiceData();
    setInvoiceData(data);
    setShowInvoiceModal(true);
  };

  // Handle reservation form submission (Step 1)
const handleReservationSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Filter out already reserved booths
  const newBooths = selectedBooths.filter(boothId => {
    return !isReservedByCurrentUser(boothId);
  });
  
  if (newBooths.length === 0) {
    setToastType('info');
    setToastMessage('All selected booths are already reserved by you.');
    setShowToast(true);
    setReservationSuccess(true);
    setCurrentStep(2);
    return;
  }

  // Use the totalAmount that was calculated and displayed in the UI
  // This is the same value shown in the Reservation Summary
  const displayedTotalAmount = calculateSubtotal();
  
  // Group new booths by location to get proper package pricing
  const newBoothsByLocation: Record<string, any> = {};
  
  // Parse booth IDs and group them
  newBooths.forEach(boothId => {
    const [locationCode, boothNum] = boothId.split('-');
    
    // Map location codes to names
    const codeToLocation: Record<string, string> = {
      'AFRICAHALL': 'Africa Hall',
      'HALLA': 'Hall A', 
      'HALLB': 'Hall B',
      'INTERNATIONAL': 'International Hall',
      'FDA': 'Food, Drinks, Agriculture & Allied Products',
      'HCT': 'Household Cosmetics & Textile Products',
      'EEI': 'ICT & Electronics Products',
      'CGA': 'Corporate Organizations & Government Agencies',
      'TA': 'Transport and Allied/Power Products',
      'RBF': 'Real Estate, Building Furniture & Fittings',
      'COG': 'Conglomerate',
      'OTH': 'Publication, Healthcare & Sport Products',
      'COP': 'Commercial Premium'
    };
    
    const locationName = codeToLocation[locationCode] || 'Africa Hall';
    const locationType = locationName.includes('Hall') ? 'hall' : 'sector';
    const sqm = boothNum?.startsWith('S') ? 6 : locationName==='Commercial Premium' || locationName==='Corporate Organizations & Government Agencies' ? 18 : 9;
    
    if (!newBoothsByLocation[locationName]) {
      newBoothsByLocation[locationName] = {
        locationName,
        locationType,
        booths: [],
        totalSqm: 0
      };
    }
    
    newBoothsByLocation[locationName].booths.push({
      boothId,
      boothNum,
      sqm,
      sector: locationCode
    });
    newBoothsByLocation[locationName].totalSqm += sqm;
  });
  
  // Calculate package prices for each location
  let recalculatedTotal = 0;
  Object.values(newBoothsByLocation).forEach((location: any) => {
    const packagePrice = calculatePackagePrice(
      location.totalSqm,
     // location.locationType,
     layoutData.name,
      location.booths
    );
    location.packagePrice = packagePrice || 0;
    recalculatedTotal += location.packagePrice;
  });
  
  // Use the displayed amount (which matches the UI) instead of recalculated
  const finalTotalAmount = displayedTotalAmount;
  
  // Prepare booth submission data
  const boothSubmitData = {
    booths: newBooths.map(id => {
      const [sector, boothNum] = id.split('-');
      const locationName = Object.keys(newBoothsByLocation).find(loc => 
        newBoothsByLocation[loc].booths.some((b: any) => b.boothId === id)
      ) || 'Africa Hall';
      
      const location = newBoothsByLocation[locationName];
      const booth = location.booths.find((b: any) => b.boothId === id);
      const boothSqm = booth?.sqm || 9;
      const boothType = `${boothSqm}sqm`;
      
      // Calculate proportional booth price based on package
      const boothPrice = Math.round(
        (boothSqm / location.totalSqm) * location.packagePrice
      );
      
      return {
        sector,
        boothNum,
        boothPrice: boothPrice.toString(),
        boothType,
        // boothSqm: boothSqm.toString(),
        // locationName,
        // locationType: location.locationType,
        // category: 'Standard'
      };
    }),
    remark: remark || '',
    boothAmount: finalTotalAmount.toString(), // Use the amount from UI
    // metadata: {
    //   totalBooths: newBooths.length,
    //   locations: Object.keys(newBoothsByLocation),
    //   createdAt: new Date().toISOString(),
    //   packageBreakdown: Object.entries(newBoothsByLocation).map(([location, data]: [string, any]) => ({
    //     location,
    //     boothCount: data.booths.length,
    //     totalSqm: data.totalSqm,
    //     packagePrice: data.packagePrice
    //   }))
    // }
  };
  
  // Debug log
  // console.log('Booth Submission Data:', {
  //   boothCount: boothSubmitData.booths.length,
  //   totalAmount: boothSubmitData.boothAmount,
  //   locations: boothSubmitData.metadata.locations,
  //   booths: boothSubmitData.booths,
  //   uiDisplayAmount: displayedTotalAmount,
  //   boothSubmitData
  // });
  
  // Submit to database
  dispatch(reserveBooths(boothSubmitData) as any)
    .unwrap()
    .then((response: any) => {
      // setFormSubmitted(true);
      setReservationSuccess(true);
      setToastType('success');
      setToastMessage(`Successfully reserved ${newBooths.length} new booth(s). Proceeding to payment...`);
      setShowToast(true);
      
      if (response.reservationIds) {
        localStorage.setItem('pendingReservationIds', JSON.stringify(response.reservationIds));
      }
      
      setCurrentStep(2);
    })
    .catch((err: any) => {
      setToastType('error');
      setToastMessage(err.message || err || 'Failed to reserve booths');
      setShowToast(true);
      console.error('Reservation Error:', err);
    });
  
};
  const handleClosePaymentDialog = (status?: string) => {
    setShowPaymentDialog(false);
    if (status === 'success') {
      // setPaymentSuccess(true);
      setCurrentStep(3);
    } else {
      setToastType('error');
      setToastMessage(`Payment ${status}. Please try again.`);
      setShowToast(true);
    }
  };

  const handlePaymentSuccess = (status?: string) => {
    if (status === 'success') {
      // setPaymentSuccess(true);
      setCurrentStep(3);
    } else {
      setToastType('error');
      setToastMessage('Payment failed. Please try again.');
      setShowToast(true);
    }
  };

  const handleCardPayment = async () => {
    if (!user?._id || !user?.email) {
      throw new Error('User information is incomplete');
    }

    console.log("Calculate Subtotal", Number(calculateSubtotal()))

    setLoading(true);
        //transactionId
        //selectLastCreatedReservation
       // console.log("Last Transaction", lastTransaction)
    if (!lastTransaction || !lastTransaction.id) {
      setToastType('error');
      setToastMessage('No valid transaction found for payment. Please try reserving again.');
      setShowToast(true);
      setLoading(false);
      return;
    }
    const response = await PaymentController.getInstance().makePayment({
      transaction_id: lastTransaction.id,
      user_id: user._id,
      email: user.email,
      amount: Number(calculateSubtotal()) + 2000,
      currency: 'NGN',
    });


    // const reference = response.data?.payment?.reference;
    // setPaymentReference(reference || null);

    console.log("Payment Response", response)

    if (response.success && response.data?.authorization_url) {
      setPaymentUrl(response.data.authorization_url);
      setLoading(false);
      setShowPaymentDialog(true);
    } else {
      setToastType('error');
      setToastMessage('Failed to initialize payment. Please try again.');
      setShowToast(true);
    }
  }
  
  // Modify handlePaymentSubmit
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    if (!reservationIds || reservationIds.length === 0) {
      setToastType('error');
      setToastMessage('No booth reservations found to process payment.');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setValidated(true);
    
    try {
      const paymentMethod = paymentInfo.paymentMethod;

      if (paymentMethod === 'card') {
        handleCardPayment();
      } else if (paymentMethod === 'cash') {
        setToastType('info');
        setToastMessage('Cash payment is not available at the moment. Please try again later.');
        setShowToast(true);
      }
    } catch (error) {
      console.log("Payment Error", error)
      setToastType('error');
      setToastMessage('An error occurred while processing payment.');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Add this after the state declarations
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3000); // Hide after 3 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showToast]);

  // Toast Component
  const ToastComponent = () => (
    showToast && (
      <ToastNotification toastType={toastType} toastMessage={toastMessage} setShowToast={setShowToast} />
    )
  );

  // Step Indicator Component
  const StepIndicator = () => (
    <div className="bg-gray-50 p-4 border-b">
      <div className="flex justify-center items-center">
        <div className={`flex flex-col items-center w-24 ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
            currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <span className="text-xs font-medium">Reservation</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-300 mt-4"></div>
        <div className={`flex flex-col items-center w-24 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
            currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
          <span className="text-xs font-medium">Payment</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-300 mt-4"></div>
        <div className={`flex flex-col items-center w-24 ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
            currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            3
          </div>
          <span className="text-xs font-medium">Confirmation</span>
        </div>
      </div>
    </div>
  );

  // Render step 1: Booth Reservation Form
const renderReservationForm = () => (
  <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
    <div className="bg-green-50 px-6 py-4 border-b">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-green-700">Step 1: Booth Reservation</h2>
        <button
          onClick={onHide}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
    
    <form onSubmit={handleReservationSubmit}>
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Selected Booths Summary</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Number of Booths:</span>
                <span>{selectedBooths.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Amount:</span>
                <span className="text-green-600 font-bold">₦{[...new Set(boothBreakdown?.map(item => item.packagePrice.toLocaleString()))]}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Sectors:</span>
                <span>{[...new Set(boothBreakdown?.map(item => item.location))]}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Validity Period:</span>
                <span className="text-red-600 font-medium">3 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Red Warning Box - 7 day validity */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex items-start">
            <AlertTriangle size={18} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              Your booth selection will be <strong>reserved for 3 days</strong>. Payment must be received within this period or your reservation will be automatically revoked.
            </div>
          </div>
        </div>

        {/* Location-based Summary Table */}
        <div className="bg-gray-50 border-2 border-blue-500 rounded-lg p-6 mb-6 shadow-lg">
          <h4 className="text-xl font-semibold text-blue-700 mb-4">
            📋 Reservation Summary
          </h4>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-blue-600 text-white text-xs uppercase">
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Booth IDs</th>
                  <th className="p-3 text-left">Total Area</th>
                  <th className="p-3 text-left">Package Price</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {boothBreakdown?.map((group) => (
                  <tr key={group.location} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{group.location}</td>
                    <td className="p-3 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {group.boothIds.map((id: string) => (
                          <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {id}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-sm">{group.totalSqm}m²</td>
                    <td className="p-3 text-sm font-medium">
                      {group.packagePrice ? `₦${group.packagePrice.toLocaleString()}` : '---'}
                    </td>
                    <td className="p-3 text-sm">
                      {group.isValid ? (
                        <span className="text-green-600">✓ Valid</span>
                      ) : (
                        <span className="text-red-600">Below minimum</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-sm font-bold text-right">Total Amount:</td>
                  <td colSpan={2} className="px-4 py-2 text-sm font-bold">
                    ₦{calculateSubtotal().toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Package Entitlements Section */}
          {boothBreakdown?.map((group) => {
            const entitlements = getEntitlements(group.totalSqm, group.locationType, group.booths);
            
            if (!entitlements) return null;
            
            return (
              <div key={`entitlements-${group.location}`} className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="text-lg font-semibold text-blue-800 mb-3">
                  📋 Package Entitlements - {group.location} ({group.totalSqm}m²)
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <span className="text-2xl">🚗</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Car Stickers</p>
                      <p className="text-xl font-bold text-blue-800">{entitlements.carStickers}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <span className="text-2xl">🎫</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Exhibitor Passes</p>
                      <p className="text-xl font-bold text-blue-800">{entitlements.passes}</p>
                    </div>
                  </div>
                  
                  {entitlements.furniture && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <span className="text-2xl">🪑</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Furniture</p>
                        <p className="text-sm font-bold text-blue-800">{entitlements.furniture}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Grand Total if multiple locations */}
          {boothBreakdown && boothBreakdown.length > 1 && (
            <div className="mt-6 bg-gray-100 rounded-lg p-4 border border-gray-300">
              <h5 className="text-lg font-semibold text-gray-800 mb-3">
                💰 Grand Total Summary
              </h5>
              <div className="space-y-2">
                {boothBreakdown.map((group) => (
                  <div key={`total-${group.location}`} className="flex justify-between">
                    <span className="text-gray-600">{group.location} ({group.totalSqm}m²):</span>
                    <span className="font-bold">
                      {group.packagePrice ? `₦${group.packagePrice.toLocaleString()}` : 'Custom Pricing'}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-gray-800">Total Amount:</span>
                    <span className="font-bold text-green-600">
                      ₦{calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remarks
          </label>
          <textarea
            rows={3}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Any special requirements or notes for your booth reservation"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
        <button
          type="button"
          onClick={onHide}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            'Reserve Booths & Proceed to Payment'
          )}
        </button>
      </div>
    </form>
  </div>
);

  // Render step 2: Payment Form
  const renderPaymentForm = () => (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="bg-green-50 px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-700">Step 2: Payment</h2>
          <button
            onClick={onHide}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <form onSubmit={handlePaymentSubmit} noValidate>
        <div className="p-0">
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Number of Booths:</span>
                  <span>{selectedBooths.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span className="text-green-600">₦{calculateSubtotal().toLocaleString()}</span>
                </div>
                {taxConfig?.enabled && (
                  <div className="flex justify-between">
                    <span className="font-medium">{taxConfig.label} ({taxConfig.rate}%) (Inclusive):</span>
                    <span>-</span>
                    {/* <span>₦{calculateTax().toLocaleString()}</span> */}
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Discount:</span>
                  <span>0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment Charges:</span>
                  <span>₦2,000</span>
                </div>

                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total Amount:</span>
                  <span className="text-green-600 font-bold">₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Reservations:</span>
                  <span>{reservationIds?.length || 0} booth{(reservationIds?.length || 0) !== 1 ? 's' : ''}</span>
                </div>
                {currencyConfig?.showForeignCurrency && (
                  <div className="flex justify-between">
                    <span className="font-medium">Amount in {currencyConfig.foreignCurrency}:</span>
                    <span>
                      {currencyConfig.foreignCurrency === 'USD' ? '$' : '€'}
                      {(calculateTotal() * currencyConfig.exchangeRates[currencyConfig.foreignCurrency]).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {reservationSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle size={18} className="text-green-600 mr-2" />
                  <p className="text-green-800">
                    Your booth reservation was successful. Please complete the payment to secure your booths.
                  </p>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Payment Options</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={paymentInfo.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="card">Pay by Card</option>
                  {/* <option value="bank">Bank Transfer</option> */}
                  {/* <option value="cash">Cheque Payment (In Office)</option> */}
                </select>
                {validated && !paymentInfo.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">Please select a payment method.</p>
                )}
              </div>
              
              {paymentInfo.paymentMethod === 'bank' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Bank Transfer Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Bank:</span> First Bank of Nigeria</p>
                    <p><span className="font-medium">Account Name:</span> Lagos International Trade Fair</p>
                    <p><span className="font-medium">Account Number:</span> 0123456789</p>
                    <p><span className="font-medium">Reference:</span> LITF-BOOTH-{Date.now().toString().slice(-8)}</p>
                  </div>
                  <p className="text-xs text-blue-700 mt-3">
                    Send proof of payment to payments@lagostradefair.com
                  </p>
                </div>
              )}
              
              {paymentInfo.paymentMethod === 'cash' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Cash Payment Instructions</h4>
                  <div className="space-y-1 text-sm">
                    <p>Visit our office at Lagos International Trade Fair Complex with your reservation reference.</p>
                    <p><span className="font-medium">Office Hours:</span> Monday-Friday, 9:00 AM - 4:00 PM</p>
                    <p><span className="font-medium">Location:</span> Administration Block, LITF Complex, Lagos</p>
                    <p><span className="font-medium">Your Reference:</span> LITF-{Date.now().toString().slice(-8)}</p>
                  </div>
                </div>
              )}
            </div>

            {paymentInfo.paymentMethod === 'card' && (
              <>
                <hr className="my-6" />
                
                <h4 className="text-lg font-medium mb-4">Billing Address</h4>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="sameAsProfile"
                      checked={paymentInfo.sameAsProfile}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Same as profile address</span>
                  </label>
                </div>
                
                {!paymentInfo.sameAsProfile && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="billingAddress"
                        value={paymentInfo.billingAddress}
                        onChange={handleInputChange}
                        required={paymentInfo.paymentMethod === 'card' && !paymentInfo.sameAsProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="billingCity"
                          value={paymentInfo.billingCity}
                          onChange={handleInputChange}
                          required={paymentInfo.paymentMethod === 'card' && !paymentInfo.sameAsProfile}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="billingState"
                          value={paymentInfo.billingState}
                          onChange={handleInputChange}
                          required={paymentInfo.paymentMethod === 'card' && !paymentInfo.sameAsProfile}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="billingPostalCode"
                          value={paymentInfo.billingPostalCode}
                          onChange={handleInputChange}
                          required={paymentInfo.paymentMethod === 'card' && !paymentInfo.sameAsProfile}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="billingCountry"
                          value={paymentInfo.billingCountry}
                          onChange={handleInputChange}
                          required={paymentInfo.paymentMethod === 'card' && !paymentInfo.sameAsProfile}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <div className="flex items-center">
                  <AlertCircle size={18} className="text-red-600 mr-2" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          <button
            type="button"
            onClick={onHide}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Pay Later
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleInvoiceClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
            >
              <FileText size={16} className="mr-2" />
              View Invoice
            </button>
            <button
              type="submit"
              disabled={loading || !paymentInfo.paymentMethod}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <span>Complete Payment</span>
                  <Check size={16} className="ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  // Render step 3: Confirmation
  const renderConfirmation = () => (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="bg-green-50 px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-700">Confirmation</h2>
          <button
            onClick={onHide}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center py-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="text-green-600" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Complete!</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your booth booking have been confirmed and payment has been processed successfully.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg text-left max-w-md mx-auto mb-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Reservation Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Booths:</span>
                <span className="font-medium">{selectedBooths.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sectors:</span>
                <span className="font-medium">{[...new Set(selectedBooths.map(id => id.split('-')[0]))].join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">
                  {paymentInfo.paymentMethod === 'card' ? 'Credit Card' : 
                   paymentInfo.paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash Payment'}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-green-600">₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 text-gray-600 max-w-lg mx-auto">
            <p>You will receive a confirmation email shortly with the details of your reservation and payment.</p>
            <p>For any assistance, please contact our support team at support@lagostradefair.com or call +234 123 456 7890.</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t">
        <button
          onClick={onHide}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Close
        </button>
      </div>
    </div>
  );

  // Main render - Modal backdrop and container
  if (!show) return null;

    return (
    <div 
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: Z_INDEX.boothReservation.backdrop }}
    >
      {paymentLoading && 
        <div className="fixed inset-0 z-1003 bg-gray-500 bg-opacity-75"
        style={{ zIndex: Z_INDEX.boothReservation.loadingOverlay }}
        >
          <LoadingOverlay isLoading={loading} />
        </div>
      }
       {/* Paystack Dialog - above loading overlay */}
    {showPaymentDialog && (
      <div style={{ zIndex: Z_INDEX.boothReservation.paymentDialog }}>
        <PaystackPaymentDialog 
          show={showPaymentDialog}
          onClose={handleClosePaymentDialog}
          paymentUrl={paymentUrl}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={(message: string) => {
            setToastType('error');
            setToastMessage(message);
            setShowToast(true);
          }}
        />
      </div>
    )}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 z-[1001]"
          onClick={onHide}
        />

        {/* Modal content */}
        <div 
         className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative"
          style={{ zIndex: Z_INDEX.boothReservation.content }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <StepIndicator />
          
          {currentStep === 1 && renderReservationForm()}
          {currentStep === 2 && renderPaymentForm()}
          {currentStep === 3 && renderConfirmation()}
        </div>
      </div>

      <ToastComponent />
      
      {/* Invoice Modal */}
      {invoiceData && (
        <InvoiceModal
          show={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          invoiceData={invoiceData}
        />
      )}
    </div>
  );
};

export default TwoStepBoothReservation;