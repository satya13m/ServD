"use client";
import React from 'react'
import { Button } from './ui/button';
import PricingModal from './PricingModal';

export default function ProLockedVersion({isPro,lockText,currentText="Upgrade to Pro →",children}) {
    return (
      <div className="relative">
        <div className={!isPro ? "blur-sm pointer-events-none" : ""}>
          {children}
        </div>

        {!isPro && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="bg-white/90 border border-stone-200 rounded-xl px-4 py-3 text-center shadow-sm">
              <div className="text-sm font-semibold text-stone">
                🔒{lockText}
              </div>
              <PricingModal>
                <Button
                  variant="ghost"
                  className="text-orange-600 hover:text-orange-600"
                >
                  {currentText}
                </Button>
              </PricingModal>
            </div>
          </div>
        )}
      </div>
    );
}


