import { CheckCircle, Info, AlertTriangle, X } from "lucide-react";

export default function ToastNotification({ toastType, toastMessage, setShowToast }: { toastType: string, toastMessage: string, setShowToast: (show: boolean) => void }) {
    return (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <div className={`rounded-lg p-4 shadow-lg ${
              toastType === 'success' ? 'bg-green-500' : 
              toastType === 'info' ? 'bg-blue-500' : 
              toastType === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            } text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {toastType === 'success' && <CheckCircle size={16} className="mr-2" />}
                  {toastType === 'info' && <Info size={16} className="mr-2" />}
                  {(toastType === 'error' || toastType === 'warning') && <AlertTriangle size={16} className="mr-2" />}
                  <span className="text-sm font-medium">{toastMessage}</span>
                </div>
                <button 
                  onClick={() => setShowToast(false)}
                  className="ml-4 text-white hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
    );
}