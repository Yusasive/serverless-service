// utils/zIndexManager.ts
export const Z_INDEX = {
  // Base layers
  base: 0,
  dropdown: 10,
  sticky: 20,
  
  // Modal layers
  modalBackdrop: 1000,
  modal: 1001,
  modalOverlay: 1002,
  
  // Specific components (properly layered)
  infoPanel: {
    backdrop: 999,
    content: 1000
  },
  boothReservation: {
    backdrop: 9000,
    content: 9001,
    // These should be ABOVE the modal content
    loadingOverlay: 9100,
    paymentDialog: 9200,
    toast: 9300  // Highest priority for notifications
  },
  
  // Invoice modal (above booth reservation)
  invoiceModal: {
    backdrop: 9500,
    content: 9501
  },
  
  // Maximum z-index for critical overlays
  maximum: 9999
} as const;