// Structured data (JSON-LD) per page.
//
// Source of truth: the SEO team's schema sheet
// https://docs.google.com/spreadsheets/d/12Va95TPOvG6Di5RFleT8zOBNxBL20blgtTi6CLGkfpc
// Copied verbatim from that sheet - edit there first, then mirror the change here.
//
// Keys are the route slug; 'home' is the "/" route. Rendered by <JsonLd />.

export type PageSchema = Record<string, unknown>;

export const pageSchemas: Record<string, PageSchema> = {
  // https://cheapfloors.ae/
  "home": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "additionalType": "OnlineStore",
        "@id": "https://cheapfloors.ae/#organization",
        "name": "Cheap Floors",
        "url": "https://cheapfloors.ae/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://cheapfloors.ae/_next/static/media/logo.5dfc9bd2.png"
        },
        "image": "https://cheapfloors.ae/_next/static/media/logo.5dfc9bd2.png",
        "areaServed": {
          "@type": "Country",
          "name": "United Arab Emirates"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+971505974385",
          "email": "cs@cheapfloors.ae",
          "contactType": "customer service",
          "areaServed": "AE",
          "availableLanguage": [
            "English",
            "Arabic"
          ]
        },
        "sameAs": [
          "https://www.facebook.com/cheapfloorsuae",
          "https://www.instagram.com/cheapfloorsuae/",
          "https://www.pinterest.com/cheapfloorsuae/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://cheapfloors.ae/#website",
        "name": "Cheap Floors",
        "url": "https://cheapfloors.ae/",
        "publisher": {
          "@id": "https://cheapfloors.ae/#organization"
        },
        "inLanguage": "en-AE"
      },
      {
        "@type": "ItemList",
        "@id": "https://cheapfloors.ae/#categories",
        "name": "Flooring Categories",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": 6,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "WebPage",
              "name": "SPC Flooring",
              "url": "https://cheapfloors.ae/spc-flooring"
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "WebPage",
              "name": "LVT Flooring",
              "url": "https://cheapfloors.ae/lvt-flooring"
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "WebPage",
              "name": "Richmond Flooring",
              "url": "https://cheapfloors.ae/richmond-flooring"
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "WebPage",
              "name": "Polar Flooring",
              "url": "https://cheapfloors.ae/polar-flooring"
            }
          },
          {
            "@type": "ListItem",
            "position": 5,
            "item": {
              "@type": "WebPage",
              "name": "Floor Smart",
              "url": "https://cheapfloors.ae/floor-smart"
            }
          },
          {
            "@type": "ListItem",
            "position": 6,
            "item": {
              "@type": "WebPage",
              "name": "Accessories",
              "url": "https://cheapfloors.ae/accessories"
            }
          }
        ]
      }
    ]
  },

  // https://cheapfloors.ae/faqs
  "faqs": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://cheapfloors.ae/faqs#faqpage",
    "url": "https://cheapfloors.ae/faqs",
    "name": "Cheap Floors — Frequently Asked Questions",
    "inLanguage": "en-AE",
    "isPartOf": {
      "@id": "https://cheapfloors.ae/#website"
    },
    "mainEntity": [
      {
        "@type": "Question",
        "name": "When can you walk on LVT flooring after the installation process?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our planks have a four-sided click-lock system for easy installation, and you can walk on them right away after the installation process. However, you should wait 48 hours before walking on glue-down LVT flooring textures, although some manufacturers recommend waiting longer."
        }
      },
      {
        "@type": "Question",
        "name": "Is SPC flooring slippery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SPC flooring features a nonslip surface material. Since SPC flooring has a low heat transfer coefficient, it provides excellent anti-skid properties. A few drops of water on SPC flooring will make it feel less slippery than ordinary tile and stone."
        }
      },
      {
        "@type": "Question",
        "name": "Is SPC flooring fireproof?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fire-retardant SPC flooring is capable of withstanding flames and delaying the spread of fire. In some ways, this flooring type has stood the test of time over other types since it has proven to be more resistant to extreme temperatures."
        }
      },
      {
        "@type": "Question",
        "name": "What are the advantages of SPC flooring?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The dark or light tone wood grain finish of SPC flooring offers a classic and bold look. SPC floor coverings contain a pre-attached IXPE or EVA foam underlay for sound insulation and a soft underfoot feel. These are used in different residential and commercial buildings. It significantly reduces the need for frequent repairs and replacements, as well as guarantees the safety of children."
        }
      },
      {
        "@type": "Question",
        "name": "Does SPC flooring feel cold?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "There's nothing better than SPC flooring underfoot, no matter what the weather is like. It is made of a stone polymer composite with wear layers, which maintains a neutral temperature in summer and a slight warmth in winter to retain heat. The warmth of this flooring makes stepping out of bed in a bedroom more comfortable than stepping on cold tiles. In homes with kids or older adults who may be sensitive to extreme temperatures, this feature is really handy."
        }
      },
      {
        "@type": "Question",
        "name": "Is SPC or LVT flooring suitable for the UAE climate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The UAE's humid and hot atmosphere is something that our Richmond SPC or LVT flooring is made to resist. It is a dependable option for both residential and commercial applications because of its heat- and water-resistant qualities. SPC and LVT provide long-term durability since they do not expand or contract in response to temperature variations like regular wood flooring does."
        }
      },
      {
        "@type": "Question",
        "name": "How much does it cost for having SPC or LVT for a room of 4m x 5m size?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Based on our entry level SPC, the approximate cost would be AED 1,100 inc VAT. For LVT, going for the entry level range, the cost would be AED 1,880 inc VAT."
        }
      },
      {
        "@type": "Question",
        "name": "Which one should I use — Herringbone or Straight Planks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This is really down to personal taste. Within straight planks, we have the Eco range (standard sizes) or, if you’d like a more authentic wood look, then we also offer the Lux and Prime planks. The bigger planks look great in a longer room but can feel a bit big in smaller areas. Herringbone styles all come in one size and can be used in narrow or wide areas. Currently, we sell an almost equal amount in both finishes, so it really is a matter of personal taste."
        }
      },
      {
        "@type": "Question",
        "name": "How do I measure my room for flooring?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To measure your room, use a tape to record the length and width in metres. Multiply these two figures to calculate the total floor area in square metres. This helps you estimate how much flooring material you will need accurately."
        }
      },
      {
        "@type": "Question",
        "name": "How much extra flooring should I order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It’s recommended to add an extra 5–10% to your total flooring requirement. This allowance covers cutting, fitting adjustments, and material waste during installation, helping you avoid shortages and delays in completing your project."
        }
      },
      {
        "@type": "Question",
        "name": "How do I measure an irregular or L-shaped room?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For irregular or L-shaped rooms, divide the space into smaller rectangular sections. Measure each section’s length and width separately, calculate their areas, and then add them together to get the total flooring area required."
        }
      },
      {
        "@type": "Question",
        "name": "What tools do I need to measure my room?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You only need basic tools such as a measuring tape, a pencil, and paper to measure your room. These simple tools allow you to record accurate dimensions and calculate the required flooring area without needing professional equipment."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer a professional measuring service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer a professional measuring service for a refundable fee of AED 150. This amount is deducted when you place an order with us, ensuring accurate measurements and helping you choose the right flooring quantity for your space."
        }
      },
      {
        "@type": "Question",
        "name": "Can heavy furniture be placed on oak SPC flooring?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The strong and resilient core layer of oak SPC flooring allows it to support heavy furniture. Compared to thinner choices (3 mm), a thicker SPC core (5 mm or more) is better able to resist dents and warping. Because of its stability, the flooring won't buckle or move even when heavy furniture is placed on it. Further, SPC flooring is more durable and impact-resistant than laminate flooring, making it a better option for spaces with heavy furniture."
        }
      },
      {
        "@type": "Question",
        "name": "Is oak SPC flooring pet-friendly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All of our durable floors are designed to withstand the rigours of kids and pets. Our flooring is completely free of formaldehyde, ensuring a safe and healthy indoor environment. We also have antibacterial coating on floors that provides excellent antibacterial properties, keeping your space clean and hygienic."
        }
      },
      {
        "@type": "Question",
        "name": "Does Polar LVT flooring fade under sunlight?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our Polar LVT Flooring UAE does not fade under sunlight. We can use them for locations that receive direct sunlight, such as sunrooms or rooms with wide windows. The reason is that it contains UV protection, which prevents fading and discolouration caused by exposure to sunshine. The floors' deep antique tones remained after years of exposure to direct sunlight, giving the spaces an energetic and appealing look."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use SPC flooring in the bathroom?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Of course. Because SPC flooring is water-resistant, it's a great option for bathrooms. It is resistant to warping, swelling, and moisture damage, unlike laminate or conventional wood. Even in regions with high humidity, its strong core and protective outer shell offer exceptional longevity. Selecting textured SPC planks will increase safety by preventing slippage in damp areas."
        }
      },
      {
        "@type": "Question",
        "name": "Can you put SPC flooring on concrete?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We often receive this question from our customers. The answer is definitely yes. Stone polymer composite (SPC) looks great on concrete subfloors. Creating a solid foundation, it reduces the possibility of warping or buckling over time. So we have to use a completely flat surface for installation."
        }
      },
      {
        "@type": "Question",
        "name": "Can I install SPC flooring myself?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. SPC flooring is an excellent option for do-it-yourself installation because of its simple 4-side click-lock mechanism. Before beginning, just make sure your subfloor is dry, clean, and level. With basic equipment like a rubber mallet, tape measure, and utility knife, the planks may be easily snapped together without the need for glue or nails. However, if you have any concerns or want a flawless finish, it's always a good idea to contact an expert."
        }
      },
      {
        "@type": "Question",
        "name": "Can I request samples?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer free flooring samples across our full range. Simply add the samples to your basket and checkout. Order up to 5 free samples delivered anywhere in the UAE so you can see and feel the quality before you buy."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a warranty on your products?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A luxury vinyl plank flooring manufacturer's warranty varies from product to product and is included with all of our flooring. Our polar products have a two-year commercial warranty and a five-year residential warranty, while our Richmond SPC and LVT floorings have a ten-year domestic warranty and a five-year commercial warranty."
        }
      },
      {
        "@type": "Question",
        "name": "How long does delivery take in the UAE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We aim to deliver all orders across the mainland UAE within 2 to 3 working days. Delivery timelines may vary slightly depending on your location, but we strive to ensure a smooth and hassle-free experience from order placement to final delivery."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer express delivery in Dubai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer express delivery within Dubai. Orders placed before the 1pm cut-off time are delivered on the next working day. This service is available for a fee of AED 150, ensuring fast and convenient delivery when you need it urgently."
        }
      },
      {
        "@type": "Question",
        "name": "Is delivery free for flooring orders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standard delivery is free within Dubai and for all other Emirates on orders above AED 2,000. For orders below AED 1,999 outside Dubai, a delivery fee of AED 200 applies, ensuring flexible and cost-effective shipping options."
        }
      },
      {
        "@type": "Question",
        "name": "Can I collect my order myself?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can choose to self-collect your order from our warehouse. Collection is available Monday to Saturday between 9am and 6pm at our Al Quoz Industrial Area 4 location in Dubai, offering a convenient alternative to delivery."
        }
      },
      {
        "@type": "Question",
        "name": "Who can I contact for delivery questions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If you have any questions or need clarification about your delivery, you can contact our team at cs@cheapfloors.ae. We are always ready to assist you and ensure your order reaches you on time without any complications."
        }
      }
    ]
  },

  // https://cheapfloors.ae/spc-flooring
  "spc-flooring": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://cheapfloors.ae/spc-flooring#webpage",
        "url": "https://cheapfloors.ae/spc-flooring",
        "name": "SPC Flooring | The Water-Resistant and Durable Choice",
        "description": "Upgrade to SPC flooring for waterproof, durable, and long-lasting floors. Perfect for homes and high-traffic areas, it quickly resists wear and tear.",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "about": {
          "@id": "https://cheapfloors.ae/#organization"
        },
        "breadcrumb": {
          "@id": "https://cheapfloors.ae/spc-flooring#breadcrumb"
        },
        "mainEntity": {
          "@id": "https://cheapfloors.ae/spc-flooring#collection"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://cheapfloors.ae/spc-flooring#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cheapfloors.ae/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "SPC Flooring",
            "item": "https://cheapfloors.ae/spc-flooring"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://cheapfloors.ae/spc-flooring#collection",
        "name": "SPC Flooring Collections",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": 3,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "WebPage",
              "name": "SPC Herringbone",
              "url": "https://cheapfloors.ae/spc-herringbone"
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "WebPage",
              "name": "SPC Prime",
              "url": "https://cheapfloors.ae/spc-prime"
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "WebPage",
              "name": "SPC Eco",
              "url": "https://cheapfloors.ae/spc-eco"
            }
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://cheapfloors.ae/spc-flooring#faq",
        "url": "https://cheapfloors.ae/spc-flooring",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What makes SPC flooring in Dubai a good choice for homes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SPC flooring Dubai is water and scratch-resistant, and durable, making it perfect for homes with kids or pets. It handles moisture well and offers long-lasting performance with minimal maintenance needs."
            }
          },
          {
            "@type": "Question",
            "name": "Is SPC flooring installation complicated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, SPC flooring installation uses a click-lock system, making it simple and fast. Professional installers or even DIY users can easily fit it without adhesives or specialised tools."
            }
          },
          {
            "@type": "Question",
            "name": "How does SPC laminate flooring differ from regular laminate or hardwood?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "«Unlike regular laminate, SPC laminate flooring has a rigid stone polymer core that is water-resistant and more durable. It outperforms hardwood in moisture-prone areas and requires far less maintenance, making it a smart long-term investment."
            }
          },
          {
            "@type": "Question",
            "name": "How do SPC flooring prices compare to natural wood?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our SPC flooring is far more economical than real wood while offering superior durability and moisture resistance, giving you a premium look for a much lower investment."
            }
          }
        ]
      }
    ]
  },

  // https://cheapfloors.ae/lvt-flooring
  "lvt-flooring": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://cheapfloors.ae/lvt-flooring#webpage",
        "url": "https://cheapfloors.ae/lvt-flooring",
        "name": "LVT Flooring - Luxury Vinyl Plank in Dubai",
        "description": "Discover the benefits of LVT flooring in Dubai. Durable, versatile, and available in various designs, it's the perfect choice for any home or business.",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "about": {
          "@id": "https://cheapfloors.ae/#organization"
        },
        "breadcrumb": {
          "@id": "https://cheapfloors.ae/lvt-flooring#breadcrumb"
        },
        "mainEntity": {
          "@id": "https://cheapfloors.ae/lvt-flooring#collection"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://cheapfloors.ae/lvt-flooring#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cheapfloors.ae/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "LVT Flooring",
            "item": "https://cheapfloors.ae/lvt-flooring"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://cheapfloors.ae/lvt-flooring#collection",
        "name": "LVT Flooring Collections",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": 2,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "WebPage",
              "name": "LVT Luxury",
              "url": "https://cheapfloors.ae/lvt-luxury"
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "WebPage",
              "name": "LVT Comfort",
              "url": "https://cheapfloors.ae/lvt-comfort"
            }
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://cheapfloors.ae/lvt-flooring#faq",
        "url": "https://cheapfloors.ae/lvt-flooring",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why is LVT flooring in Dubai popular for modern interiors?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "LVT flooring in the UAE is stylish, durable, and water-resistant. It mimics natural materials while being easier to maintain, making it ideal for both residential and commercial spaces."
            }
          },
          {
            "@type": "Question",
            "name": "How is LVT flooring installation done — can it go over existing floors?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! LVT flooring installation uses a floating click-lock method that works over most existing surfaces, including tiles and concrete. No adhesive is required, saving time and reducing labour costs significantly across Dubai homes and offices."
            }
          },
          {
            "@type": "Question",
            "name": "Is LVT flooring installation suitable for all spaces?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, LVT flooring installation works in homes, offices, and retail areas. Its multiple installation methods make it adaptable to different subfloors and design requirements."
            }
          },
          {
            "@type": "Question",
            "name": "Can LVT vinyl flooring be used in commercial shops?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, luxury vinyl flooring is incredibly hard-wearing. It is designed to withstand heavy foot traffic and frequent cleaning, making it a top choice for retail environments in the UAE."
            }
          }
        ]
      }
    ]
  },

  // https://cheapfloors.ae/richmond-flooring
  "richmond-flooring": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://cheapfloors.ae/richmond-flooring#webpage",
        "url": "https://cheapfloors.ae/richmond-flooring",
        "name": "Richmond Floorings - Premium Vinyl Flooring",
        "description": "Our range of Richmond flooring vinyl is designed for longevity. This flooring is a versatile choice for both residential and commercial spaces.",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "about": {
          "@id": "https://cheapfloors.ae/richmond-flooring#brand"
        },
        "breadcrumb": {
          "@id": "https://cheapfloors.ae/richmond-flooring#breadcrumb"
        },
        "mainEntity": {
          "@id": "https://cheapfloors.ae/richmond-flooring#collection"
        }
      },
      {
        "@type": "Brand",
        "@id": "https://cheapfloors.ae/richmond-flooring#brand",
        "name": "Richmond",
        "description": "Richmond flooring range — premium SPC and LVT vinyl flooring supplied in the UAE by Cheap Floors.",
        "url": "https://cheapfloors.ae/richmond-flooring"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://cheapfloors.ae/richmond-flooring#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cheapfloors.ae/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Richmond Flooring",
            "item": "https://cheapfloors.ae/richmond-flooring"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://cheapfloors.ae/richmond-flooring#collection",
        "name": "Richmond Flooring Collections",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": 5,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "WebPage",
              "name": "Richmond SPC Herringbone",
              "url": "https://cheapfloors.ae/spc-herringbone"
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "WebPage",
              "name": "Richmond SPC Prime",
              "url": "https://cheapfloors.ae/spc-prime"
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "WebPage",
              "name": "Richmond SPC Eco",
              "url": "https://cheapfloors.ae/spc-eco"
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "WebPage",
              "name": "Richmond LVT Luxury",
              "url": "https://cheapfloors.ae/lvt-luxury"
            }
          },
          {
            "@type": "ListItem",
            "position": 5,
            "item": {
              "@type": "WebPage",
              "name": "Richmond LVT Comfort",
              "url": "https://cheapfloors.ae/lvt-comfort"
            }
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://cheapfloors.ae/richmond-flooring#faq",
        "url": "https://cheapfloors.ae/richmond-flooring",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where can I buy Richmond flooring in Dubai for my project?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can buy Richmond flooring in Dubai from trusted suppliers offering a wide range of designs. For premium options and reliable service, consider purchasing from a trusted supplier like cheapfloors.ae, known for delivering high-quality flooring solutions."
            }
          },
          {
            "@type": "Question",
            "name": "Is Richmond LVT flooring suitable for commercial use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Richmond LVT flooring is durable and designed for high-traffic areas like offices, hotels, and retail spaces, ensuring long-lasting performance and style in Dubai. We’re so confident in the quality of our products that we offer a 5-year warranty against manufacturing defects for commercial use and a 10-year warranty for residential use in Dubai."
            }
          },
          {
            "@type": "Question",
            "name": "What are the benefits of Richmond SPC flooring in Dubai?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Richmond SPC flooring Dubai offers water-resistant protection, scratch resistance, and strong core stability, making it ideal for both residential and commercial spaces."
            }
          },
          {
            "@type": "Question",
            "name": "How easy is Richmond vinyl flooring installation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Richmond vinyl flooring features a click-lock system, enabling fast, adhesive-free installation in Dubai, saving time and reducing labor costs."
            }
          }
        ]
      }
    ]
  },

  // https://cheapfloors.ae/polar-flooring
  "polar-flooring": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://cheapfloors.ae/polar-flooring#webpage",
        "url": "https://cheapfloors.ae/polar-flooring",
        "name": "Polar Floorings – Premium Vinyl Tiles For Busy Homes",
        "description": "Upgrade your home with Polar Flooring's durable, low-maintenance options. Explore SPC, LVT, and Herringbone styles for beauty without the hassle.",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "about": {
          "@id": "https://cheapfloors.ae/polar-flooring#brand"
        },
        "breadcrumb": {
          "@id": "https://cheapfloors.ae/polar-flooring#breadcrumb"
        },
        "mainEntity": {
          "@id": "https://cheapfloors.ae/polar-flooring#collection"
        }
      },
      {
        "@type": "Brand",
        "@id": "https://cheapfloors.ae/polar-flooring#brand",
        "name": "Polar",
        "description": "Polar flooring range — durable SPC and LVT vinyl flooring supplied in the UAE by Cheap Floors.",
        "url": "https://cheapfloors.ae/polar-flooring"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://cheapfloors.ae/polar-flooring#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cheapfloors.ae/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Polar Flooring",
            "item": "https://cheapfloors.ae/polar-flooring"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://cheapfloors.ae/polar-flooring#collection",
        "name": "Polar Flooring Collections",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": 3,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "WebPage",
              "name": "Polar SPC Herringbone",
              "url": "https://cheapfloors.ae/spc-herringbone"
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "WebPage",
              "name": "Polar SPC Eco",
              "url": "https://cheapfloors.ae/spc-eco"
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "WebPage",
              "name": "Polar LVT Comfort",
              "url": "https://cheapfloors.ae/lvt-comfort"
            }
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://cheapfloors.ae/polar-flooring#faq",
        "url": "https://cheapfloors.ae/polar-flooring",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why should I buy Polar flooring for my home?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Buy Polar flooring for its durability, affordability, and stylish designs in Dubai. It is water-resistant and easy to maintain, making it perfect for busy households."
            }
          },
          {
            "@type": "Question",
            "name": "What makes Polar SPC flooring Dubai a reliable option?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Polar SPC flooring in Dubai is highly durable, water-resistant, and scratch-resistant, making it ideal for high-traffic areas and long-term use."
            }
          },
          {
            "@type": "Question",
            "name": "Is Polar vinyl flooring suitable for commercial spaces in Dubai?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Polar vinyl flooring Dubai is designed for heavy use, offering durability and easy maintenance, making it perfect for offices, retail, and hospitality spaces."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use Polar LVT flooring in my bathroom?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Definitely. All polar flooring products are water-resistant and slip-resistant, making them a safe and stylish choice for wet areas like bathrooms and laundry rooms in Dubai."
            }
          }
        ]
      }
    ]
  },

  // https://cheapfloors.ae/floor-smart
  "floor-smart": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://cheapfloors.ae/floor-smart#webpage",
        "url": "https://cheapfloors.ae/floor-smart",
        "name": "Floor Smart SPC Flooring | Water-resistant, & Durable SPC Floors",
        "description": "Discover Floor Smart SPC flooring in Dubai – 100% water-resistant, termite-free, and durable. Affordable floors with easy installation. Show now.",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "about": {
          "@id": "https://cheapfloors.ae/floor-smart#brand"
        },
        "breadcrumb": {
          "@id": "https://cheapfloors.ae/floor-smart#breadcrumb"
        },
        "mainEntity": {
          "@id": "https://cheapfloors.ae/floor-smart#collection"
        }
      },
      {
        "@type": "Brand",
        "@id": "https://cheapfloors.ae/floor-smart#brand",
        "name": "Floor Smart",
        "description": "Floor Smart flooring range — water-resistant, termite-resistant SPC vinyl flooring supplied in the UAE by Cheap Floors.",
        "url": "https://cheapfloors.ae/floor-smart"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://cheapfloors.ae/floor-smart#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cheapfloors.ae/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Floor Smart",
            "item": "https://cheapfloors.ae/floor-smart"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://cheapfloors.ae/floor-smart#collection",
        "name": "Floor Smart Flooring Collections",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": 1,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "WebPage",
              "name": "Floor Smart SPC Eco",
              "url": "https://cheapfloors.ae/spc-eco"
            }
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://cheapfloors.ae/floor-smart#faq",
        "url": "https://cheapfloors.ae/floor-smart",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What makes Floor Smart SPC flooring in Dubai a good choice?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Floor Smart SPC flooring in Dubai is fully water-resistant, termite-resistant, and highly durable. It is designed to handle moisture, heavy foot traffic, and daily wear, making it ideal for homes and commercial spaces in Dubai."
            }
          },
          {
            "@type": "Question",
            "name": "Is Floor Smart SPC installation complicated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, Floor Smart SPC flooring uses a Unilin click-lock system, allowing quick and easy installation without adhesives. It is suitable for both professionals and DIY installation."
            }
          },
          {
            "@type": "Question",
            "name": "How does Floor Smart SPC flooring compare to other flooring options?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Floor Smart SPC flooring offers better water resistance, durability, and lower maintenance compared to hardwood and laminate flooring, making it a practical long-term investment."
            }
          },
          {
            "@type": "Question",
            "name": "Are SPC flooring prices in Dubai affordable?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Floor Smart offers competitive SPC flooring prices in Dubai, providing a premium wood-look finish at a much more economical cost than natural wood."
            }
          }
        ]
      }
    ]
  },

  // https://cheapfloors.ae/accessories
  "accessories": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://cheapfloors.ae/accessories#webpage",
        "url": "https://cheapfloors.ae/accessories",
        "name": "Best Flooring Accessories for a Professional Finish",
        "description": "Cheap Floors offers high-quality flooring accessories, including reducers, sealers, trims, and more. These are perfect for a professional, long-lasting finish. Shop now.",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "about": {
          "@id": "https://cheapfloors.ae/#organization"
        },
        "breadcrumb": {
          "@id": "https://cheapfloors.ae/accessories#breadcrumb"
        },
        "mainEntity": {
          "@id": "https://cheapfloors.ae/accessories#collection"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://cheapfloors.ae/accessories#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cheapfloors.ae/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Accessories",
            "item": "https://cheapfloors.ae/accessories"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://cheapfloors.ae/accessories#collection",
        "name": "Flooring Accessories",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": 10,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Product",
              "name": "Reducer",
              "url": "https://cheapfloors.ae/accessories/reducer",
              "image": "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1743232657/uploads/jx2xjzfde4dpgczh2aec.webp",
              "category": "Flooring Accessories",
              "brand": {
                "@id": "https://cheapfloors.ae/#organization"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://cheapfloors.ae/accessories/reducer",
                "price": "64",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@id": "https://cheapfloors.ae/#organization"
                }
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "Product",
              "name": "T Profile",
              "url": "https://cheapfloors.ae/accessories/t-profile",
              "image": "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1743230039/uploads/iyptb6rxyj7ddwbd4k9x.webp",
              "category": "Flooring Accessories",
              "brand": {
                "@id": "https://cheapfloors.ae/#organization"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://cheapfloors.ae/accessories/t-profile",
                "price": "64",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@id": "https://cheapfloors.ae/#organization"
                }
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "Product",
              "name": "Stair Nose",
              "url": "https://cheapfloors.ae/accessories/stair-nose",
              "image": "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1743232095/uploads/yrkpien17qsp2cprruop.webp",
              "category": "Flooring Accessories",
              "brand": {
                "@id": "https://cheapfloors.ae/#organization"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://cheapfloors.ae/accessories/stair-nose",
                "price": "64",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@id": "https://cheapfloors.ae/#organization"
                }
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "Product",
              "name": "Quarter Round",
              "url": "https://cheapfloors.ae/accessories/quarter-round",
              "image": "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1743230376/uploads/j26ztfpeawwxptpbnpiu.webp",
              "category": "Flooring Accessories",
              "brand": {
                "@id": "https://cheapfloors.ae/#organization"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://cheapfloors.ae/accessories/quarter-round",
                "price": "64",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@id": "https://cheapfloors.ae/#organization"
                }
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 5,
            "item": {
              "@type": "Product",
              "name": "L Shape Skirting 10cm Height",
              "url": "https://cheapfloors.ae/accessories/l-shape-skirting-10cm",
              "image": "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1785909327/uploads/dv44r8cofes0vjkfapn8.avif",
              "category": "Flooring Accessories",
              "brand": {
                "@id": "https://cheapfloors.ae/#organization"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://cheapfloors.ae/accessories/l-shape-skirting-10cm",
                "price": "64",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@id": "https://cheapfloors.ae/#organization"
                }
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 6,
            "item": {
              "@type": "Product",
              "name": "L Shape Skirting 12cm Height",
              "url": "https://cheapfloors.ae/accessories/l-shape-skirting-12cm",
              "image": "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1764851219/uploads/j1jddyev8xighmqgk8yf.jpg",
              "category": "Flooring Accessories",
              "brand": {
                "@id": "https://cheapfloors.ae/#organization"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://cheapfloors.ae/accessories/l-shape-skirting-12cm",
                "price": "64",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@id": "https://cheapfloors.ae/#organization"
                }
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 7,
            "item": {
              "@type": "Product",
              "name": "L Shape Skirting 15cm Height",
              "url": "https://cheapfloors.ae/accessories/l-shape-skirting-15cm",
              "image": "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1764851328/uploads/hzuqxvla7ywvwucp4ekp.jpg",
              "category": "Flooring Accessories",
              "brand": {
                "@id": "https://cheapfloors.ae/#organization"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://cheapfloors.ae/accessories/l-shape-skirting-15cm",
                "price": "64",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@id": "https://cheapfloors.ae/#organization"
                }
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 8,
            "item": {
              "@type": "Product",
              "name": "Skirting 8cm Height",
              "url": "https://cheapfloors.ae/accessories/skirting-8cm",
              "image": "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1743233442/uploads/cdazfibsewesqgytxsgl.webp",
              "category": "Flooring Accessories",
              "brand": {
                "@id": "https://cheapfloors.ae/#organization"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://cheapfloors.ae/accessories/skirting-8cm",
                "price": "64",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@id": "https://cheapfloors.ae/#organization"
                }
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 9,
            "item": {
              "@type": "Product",
              "name": "Skirting 12cm Height",
              "url": "https://cheapfloors.ae/accessories/skirting-12cm",
              "image": "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1746523557/uploads/du1ll0dnhw9cmich96wy.webp",
              "category": "Flooring Accessories",
              "brand": {
                "@id": "https://cheapfloors.ae/#organization"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://cheapfloors.ae/accessories/skirting-12cm",
                "price": "64",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@id": "https://cheapfloors.ae/#organization"
                }
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 10,
            "item": {
              "@type": "Product",
              "name": "Skirting 10cm Height",
              "url": "https://cheapfloors.ae/accessories/skirting-10cm",
              "image": "https://res.cloudinary.com/dmmeqgdhv/image/upload/v1746526557/uploads/ja0vfglupkhpdryahbpv.webp",
              "category": "Flooring Accessories",
              "brand": {
                "@id": "https://cheapfloors.ae/#organization"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://cheapfloors.ae/accessories/skirting-10cm",
                "price": "64",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@id": "https://cheapfloors.ae/#organization"
                }
              }
            }
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://cheapfloors.ae/accessories#faq",
        "url": "https://cheapfloors.ae/accessories",
        "inLanguage": "en-AE",
        "isPartOf": {
          "@id": "https://cheapfloors.ae/#website"
        },
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why are flooring accessories important for floor installation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Flooring accessories enhance both the appearance and functionality of your flooring. Products like skirting and reducers protect edges, cover expansion gaps, reduce wear and tear, and give your flooring project a polished final look."
            }
          },
          {
            "@type": "Question",
            "name": "What is the purpose of a stair nose in flooring?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A stair nose is designed to protect the edges of stairs from damage while improving safety and appearance. It provides a smooth transition on stair edges and helps prevent slipping and premature wear."
            }
          },
          {
            "@type": "Question",
            "name": "Which skirting sizes are available at Cheap Floors?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cheap Floors offers skirting in several heights, including 8cm, 10cm, and 12cm, as well as L-shaped skirting in 12cm and 15cm, allowing customers to choose the perfect style for their interiors."
            }
          },
          {
            "@type": "Question",
            "name": "Are Cheap Floors accessories suitable for both residential and commercial spaces?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Cheap Floors flooring accessories are designed for both residential and commercial applications. They are made with high-quality materials to ensure durability, long-lasting performance, and a stylish finish in any environment."
            }
          },
          {
            "@type": "Question",
            "name": "Can DIY users easily install Cheap Floors accessories?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely. Cheap Floors accessories are suitable for both professional installers and DIY enthusiasts. Their practical designs make installation straightforward while ensuring a clean and attractive flooring finish."
            }
          }
        ]
      }
    ]
  }
};

export default pageSchemas;
