'use client';
import { useEffect } from 'react';
import Shipping from './Shipping';
import { openDB } from 'utils/indexedDB';

const FreeSampleThank = ({ orderId }: { orderId?: string }) => {
  const clearFreeSample = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('freeSample', 'readwrite');
      const store = tx.objectStore('freeSample');
      store.clear();
      tx.oncomplete = () => {
        window.dispatchEvent(new Event('freeSampleUpdated'));
      };
      tx.onerror = () => {
        console.error('Failed to clear freeSample store');
      };
    } catch (error) {
      console.error('Error accessing IndexedDB:', error);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    clearFreeSample();
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 font-inter">
      <h1 className="text-[32px] sm:text-[40px] font-bold text-center text-black tracking-wide">
        THANK YOU!
      </h1>
      <p className="text-center mt-3 text-[14px] sm:text-[15px] text-black max-w-2xl mx-auto leading-relaxed">
        An order confirmation email has been sent to your inbox with all the
        details. We&apos;ll process your sample shortly, and you&apos;ll receive
        a notification once it&apos;s on the way.
      </p>
      <Shipping />
    </div>
  );
};

export default FreeSampleThank;
