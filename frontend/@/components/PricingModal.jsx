"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import PricingSection from "./PricingSection";

// for the dialog box of price model , we will use shadcn ui
const PricingModal = ({ subscriptionTier = "free", children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const canOpen = subscriptionTier === "free";
  return (
    <Dialog open={isOpen} onOpenChange={canOpen ? setIsOpen : undefined}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="p-8 pt-4 sm:mx-w-4xl">
        <DialogTitle>
          <PricingSection/>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;

// "use client";
// import React, { useState } from "react";
// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

// const PricingModal = ({ subscriptionTier = "free", children }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>{children}</DialogTrigger>

//       <DialogContent className="p-8 pt-4 sm:mx-w-4xl">
//         <DialogTitle>PricingSection</DialogTitle>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PricingModal;

