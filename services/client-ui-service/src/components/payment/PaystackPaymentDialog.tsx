import React from 'react';
import { X } from 'lucide-react';
import { PaymentController } from '@/controllers/PaymentController';
//  import { useDispatch } from 'react-redux'; // ADD THIS IMPORT
 //import {updateBoothTransactionStatus} from '../../store/booth-slice'; // FIXED IMPORT
import {Z_INDEX} from '../../utils/zIndexManager';
import { BoothController } from '@/controllers/BoothController';
interface PaystackPaymentDialogProps {
  show: boolean;
  onClose: (status?: string) => void;
  paymentUrl: string;
  onPaymentSuccess: (status?: string) => void;
  onPaymentError: (message: string) => void;
   style?: React.CSSProperties;
}

const PaystackPaymentDialog: React.FC<PaystackPaymentDialogProps> = ({
  show,
  onClose,
  paymentUrl,
  onPaymentSuccess,
  onPaymentError,
  style 
}) => {
  //  const dispatch = useDispatch(); // ADD THIS LINE
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto"
    style={{ ...style, zIndex: style?.zIndex || Z_INDEX.boothReservation.paymentDialog }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <button onClick={() => onClose("abandoned")} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <X size={24} />
        </button>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="w-full h-[600px]">
              <iframe 
                src={paymentUrl}
                className="w-full h-full border-0"
                title="Payment"
                onLoad={(e) => {
                  const iframe = e.target as HTMLIFrameElement;
                
                  (async () => {
                    try {
                      const href = iframe.contentWindow?.location.href;

                      if (href && href.includes('/paystack')) {
                        return;
                      }
                      
                      // Only process if we have a URL and it's a checkout response
                      if (href && href.includes('/payment-checkout')) {
                        const url = new URL(href);
                        const reference = url.searchParams.get('reference');
                        
                        // Only proceed if we have a reference and status
                        if (reference) {
                          const response = await PaymentController.getInstance().verifyPayment({
                            reference,
                          });

                          console.log("Verificationresponse", response);
                          
                          if (response.success && response.data) {
                           // ADD THIS DISPATCH CALL
                            // dispatch(updateBoothTransactionStatus({ transactionId: response.data?.transactionId,         
                            //   status: 'paid'
                            // }));
                           
                            await BoothController.getInstance().updateBoothTransactionStatus({
                              transactionId: response.data?.transactionId,  
                              status: "paid",
                            });
                              console.log("Booth transaction status updated successfully");
                            onPaymentSuccess(response.data?.payStackstatus);

                            onClose(response.data?.payStackstatus);
                          } else {
                            onPaymentError('Payment failed. Please try again.');
                            onClose(response.data?.payStackstatus);
                          }
                        }
                      }
                    } catch (error) {
                      // Only show error if we were actually processing a payment response
                      if (iframe.contentWindow?.location.href?.includes('/checkout')) {
                        console.error('Payment processing error:', error);
                        onPaymentError('Failed to process payment. Please try again.');
                      }
                    }
                  })();
                }}                  
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaystackPaymentDialog; 