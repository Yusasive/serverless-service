import React, { useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { useSelector } from "react-redux";
import {
  selectBoothTransactions,
  selectActiveReservations,
  selectPaidReservations,
} from "../../../store/booth-slice";

// SetupCard component interface (assuming this exists)
interface SetupCardProps {
  title: string;
  percent: number;
  status: string;
}
// Add this component definition before ExhibitorSetupProgress
const SetupCard: React.FC<SetupCardProps> = ({ title, percent, status }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <div className="text-2xl font-bold mb-1">{percent}%</div>
      <p className="text-sm text-gray-600">{status}</p>
    </div>
  );
};
// Enhanced Setup Progress Component
export function ExhibitorSetupProgress() {
  const { user, loading } = useUser();
  const boothTransactions = useSelector(selectBoothTransactions);
  const activeReservations = useSelector(selectActiveReservations);
  const paidReservations = useSelector(selectPaidReservations);

  // Calculate profile completion percentage and missing items
  const profileProgress = useMemo(() => {
    if (!user)
      return {
        percent: 0,
        missing: ["Complete profile setup"],
        status: "Please complete your profile",
      };

    const requiredFields = [
      { field: "firstName", label: "First name" },
      { field: "lastName", label: "Last name" },
      { field: "email", label: "Email address" },
      { field: "phone", label: "Phone number" },
      { field: "company", label: "Company name" },
      { field: "address", label: "Company address" },
    ];

    const completed = requiredFields.filter(({ field }) => {
      if (field === "address") {
        return (
          user.address &&
          user.address.length > 0 &&
          user.address[0].address_line1
        );
      }
      return (
        user[field as keyof typeof user] &&
        user[field as keyof typeof user] !== ""
      );
    });

    const missing = requiredFields
      .filter(({ field }) => {
        if (field === "address") {
          return (
            !user.address ||
            user.address.length === 0 ||
            !user.address[0]?.address_line1
          );
        }
        return (
          !user[field as keyof typeof user] ||
          user[field as keyof typeof user] === ""
        );
      })
      .map(({ label }) => label);

    const percent = Math.round(
      (completed.length / requiredFields.length) * 100
    );

    let status = "";
    if (percent === 100) {
      status = "Complete";
    } else if (missing.length === 1) {
      status = `Missing: ${missing[0]}`;
    } else if (missing.length <= 3) {
      status = `Missing: ${missing.join(", ")}`;
    } else {
      status = `${missing.length} items remaining`;
    }

    return { percent, missing, status };
  }, [user]);

  // Calculate booth progress
  const boothProgress = useMemo(() => {
    const totalReservations = boothTransactions.length;
    const paidCount = paidReservations.length;
    const activeCount = activeReservations.length;

    if (totalReservations === 0) {
      return {
        percent: 0,
        status: "No booth reservations",
        color: "red" as const,
        icon: "warning",
      };
    }

    if (paidCount === totalReservations) {
      return {
        percent: 100,
        status: "All booths paid",
        color: "green" as const,
        icon: "check",
      };
    }

    if (activeCount > 0) {
      const percent = Math.round((paidCount / totalReservations) * 100);
      return {
        percent,
        status: `${activeCount} pending payment`,
        color: "yellow" as const,
        icon: "pending",
      };
    }

    return {
      percent: 50,
      status: "Booths reserved",
      color: "blue" as const,
      icon: "booth",
    };
  }, [boothTransactions, paidReservations, activeReservations]);

  // Calculate payment progress
  const paymentProgress = useMemo(() => {
    const totalAmount = boothTransactions.reduce((sum, transaction) => {
      const amount =
        typeof transaction.totalAmount === "string"
          ? parseInt(transaction.totalAmount.replace(/[^\d]/g, "")) || 0
          : transaction.totalAmount || 0;
      return sum + amount;
    }, 0);

    const paidAmount = paidReservations.reduce((sum, transaction) => {
      const amount =
        typeof transaction.totalAmount === "string"
          ? parseInt(transaction.totalAmount.replace(/[^\d]/g, "")) || 0
          : transaction.totalAmount || 0;
      return sum + amount;
    }, 0);

    if (totalAmount === 0) {
      return {
        percent: 0,
        status: "No payments due",
        color: "red" as const,
        icon: "payment",
      };
    }

    const percent = Math.round((paidAmount / totalAmount) * 100);

    if (percent === 100) {
      return {
        percent: 100,
        status: "All payments complete",
        color: "green" as const,
        icon: "check",
      };
    }

    if (percent > 0) {
      return {
        percent,
        status: `₦${(totalAmount - paidAmount).toLocaleString()} remaining`,
        color: "yellow" as const,
        icon: "pending",
      };
    }

    return {
      percent: 0,
      status: `₦${totalAmount.toLocaleString()} due`,
      color: "red" as const,
      icon: "warning",
    };
  }, [boothTransactions, paidReservations]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const weights = {
      profile: 0.4, // 40% weight
      booth: 0.3, // 30% weight
      payment: 0.3, // 30% weight
    };

    const weighted =
      profileProgress.percent * weights.profile +
      boothProgress.percent * weights.booth +
      paymentProgress.percent * weights.payment;

    return Math.round(weighted);
  }, [profileProgress.percent, boothProgress.percent, paymentProgress.percent]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 bg-white border-b">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border-b">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Exhibitor Setup Progress
        </h2>
        <p className="text-sm text-gray-600 mb-4">Complete your setup</p>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              overallProgress < 50
                ? "bg-red-500"
                : overallProgress < 70
                  ? "bg-lime-400"
                  : "bg-green-600"
            }`}
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {overallProgress}% Complete
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SetupCard
          title="Company Details"
          percent={profileProgress.percent}
          status={profileProgress.status}
          // icon={profileProgress.percent === 100 ? "check" : "profile"}
          // color={profileProgress.percent === 100 ? "green" : profileProgress.percent > 50 ? "yellow" : "red"}
          // progressType="stepped"
        />

        <SetupCard
          title="Booth"
          percent={boothProgress.percent}
          status={boothProgress.status}
          // icon={boothProgress.icon}
          // color={boothProgress.color}
          // progressType="circular"
        />

        <SetupCard
          title="Payment"
          percent={paymentProgress.percent}
          status={paymentProgress.status}
          // icon={paymentProgress.icon}
          // color={paymentProgress.color}
          // progressType="circular"
        />
      </div>

      {/* Additional quick actions based on status */}
      {overallProgress < 100 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Quick Actions to Complete Setup:
          </h3>
          <div className="space-y-1 text-xs text-blue-800">
            {profileProgress.percent < 100 && (
              <div>
                • Complete your profile: {profileProgress.missing.join(", ")}
              </div>
            )}
            {boothProgress.percent === 0 && (
              <div>• Reserve your exhibition booth</div>
            )}
            {paymentProgress.percent < 100 && boothTransactions.length > 0 && (
              <div>• Complete payment for reserved booths</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Alternative version with more detailed breakdown
export function DetailedExhibitorSetupProgress() {
  const { user } = useUser();
  const boothTransactions = useSelector(selectBoothTransactions);
  const paidReservations = useSelector(selectPaidReservations);

  // Get specific profile completion details
  const profileDetails = useMemo(() => {
    if (!user) return { items: [], percent: 0 };

    const items = [
      {
        name: "Basic Info",
        completed: !!(
          user.firstName &&
          user.lastName &&
          user.email &&
          user.phone
        ),
        required: true,
      },
      {
        name: "Company Info",
        completed: !!user.company,
        required: true,
      },
      {
        name: "Address",
        completed: !!(
          user.address &&
          user.address.length > 0 &&
          user.address[0].address_line1
        ),
        required: true,
      },
      {
        name: "Profile Photo",
        completed: !!user.profileImage,
        required: false,
      },
    ];

    const requiredItems = items.filter((item) => item.required);
    const completedRequired = requiredItems.filter((item) => item.completed);
    const percent = Math.round(
      (completedRequired.length / requiredItems.length) * 100
    );

    return { items, percent };
  }, [user]);

  // Get booth details
  const boothDetails = useMemo(() => {
    const totalBooths = boothTransactions.reduce(
      (sum, t) => sum + t.boothCount,
      0
    );
    const paidBooths = paidReservations.reduce(
      (sum, t) => sum + t.boothCount,
      0
    );

    return {
      total: totalBooths,
      paid: paidBooths,
      pending: totalBooths - paidBooths,
      reservations: boothTransactions.length,
    };
  }, [boothTransactions, paidReservations]);

  return (
    <div className="p-6 bg-white border-b">
      {/* Overall progress bar and cards */}
      <ExhibitorSetupProgress />

      {/* Detailed breakdown */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile breakdown */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Profile Completion</h3>
          <div className="space-y-2">
            {profileDetails.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span
                  className={item.required ? "text-gray-700" : "text-gray-500"}
                >
                  {item.name} {!item.required && "(Optional)"}
                </span>
                <span
                  className={
                    item.completed ? "text-green-600" : "text-gray-400"
                  }
                >
                  {item.completed ? "✓" : "○"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Booth breakdown */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Booth Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Booths:</span>
              <span className="font-medium">{boothDetails.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid Booths:</span>
              <span className="text-green-600 font-medium">
                {boothDetails.paid}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pending Payment:</span>
              <span className="text-yellow-600 font-medium">
                {boothDetails.pending}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Reservations:</span>
              <span className="font-medium">{boothDetails.reservations}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
