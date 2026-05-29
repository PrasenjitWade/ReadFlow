import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-section" className="py-16 border-t border-white/5 bg-[#050914] relative">
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 font-light text-sm">
            Everything you need to know about the purchase, downloads, compatibility formats, and update guarantees.
          </p>
        </div>

        <div className="flex flex-col gap-3.5 max-w-2xl mx-auto">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id}
                className="rounded-2xl bg-[#0c111d] border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10"
              >
                <button
                  id={`faq-toggle-${item.id}`}
                  onClick={() => toggleFaq(item.id)}
                  className="w-full flex items-center justify-between text-left p-5 transition-colors focus:outline-none"
                >
                  <span className="flex items-center gap-3 font-display font-medium text-xs sm:text-sm text-gray-100 pr-4">
                    <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-60 border-t border-white/5' : 'max-h-0'
                  }`}
                >
                  <p className="p-5 text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
