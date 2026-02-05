import {
  BoxData,
  CardData,
  FAQItem,
  Feature,
  HeroItem,
  TCategoryData
} from 'types/type';
import {
  AuthData,
  CategoryFeatures,
  FAQ,
  SampleGridData,
  SocialLink,
  TAboutUs
} from 'types/types';
import * as Yup from 'yup';
import { AdditionalInformation } from 'types/prod';
import { EDIT_CATEGORY, ISUBCATEGORY_EDIT } from 'types/cat';
import { MeasurementSection } from '../types/types';

export const generateSlug = (text: string) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const initialValues = {
  firstname: '',
  phoneNumber: '',
  whatsappNumber: '',
  email: '',
  area: '',
  selectRooms: '',
  preferredDate: '',
  preferredTime: '',
  findUs: '',
  comment: '',
  contactMethod: {
    whatsapp: false,
    telephone: false,
    email: false
  }
};

export const validationSchema = Yup.object({
  firstname: Yup.string().required('Name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  // whatsappNumber: Yup.string().required("WhatsApp number is required"),
  email: Yup.string().email('Invalid email').required('Email is required'),
  area: Yup.string().required('Area is required'),
  selectRooms: Yup.string().required('Select the number of rooms'),
  preferredDate: Yup.string().required('Preferred date is required'),
  preferredTime: Yup.string().required('Preferred time is required')
});

export const categoryInitialValues: EDIT_CATEGORY = {
  name: '',
  description: '',
  short_description: '',
  Meta_Description: '',
  Meta_Title: '',
  Canonical_Tag: '',
  custom_url: '',
  topHeading: '',
  recalledSubCats: [],
  price: ''
};

export const subcategoryValidationSchema = Yup.object({
  name: Yup.string().required('Add Sub Category Name'),
  category: Yup.string().required('Select Category'),
  custom_url: Yup.string().required('Custom URL is required')
});

export const categoryValidationSchema = Yup.object({
  name: Yup.string().required('Add  Category Name'),
  custom_url: Yup.string().required('Custom URL is required'),
  RecallUrl: Yup.string().required(
    'Custom URL is required for categories and products'
  )
});

export const subcategoryInitialValues: ISUBCATEGORY_EDIT = {
  name: '',
  description: '',
  short_description: '',
  Meta_Description: '',
  Meta_Title: '',
  custom_url: '',
  category: '',
  Canonical_Tag: '',
  whatamIdetails: [],
  whatAmiTopHeading: '',
  Heading: '',
  recalledByCategories: [],
  recalledSubCats: [],
  whatIamEndpoint: ''
};
export interface IProductValues {
  id?: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  discountPrice?: number;
  AdditionalInformation: AdditionalInformation[];
  custom_url: string;
  plankWidth?: string;
  thickness?: string;
  ResidentialWarranty?: string;
  CommmericallWarranty?: string;
  waterproof?: boolean;
  Meta_Title?: string;
  Canonical_Tag?: string;
  Meta_Description?: string;
  FAQS: AdditionalInformation[];
  boxCoverage?: string;
  products: (string | number)[];
  colorCode?: string;
  colors?: AdditionalInformation[];
  sizes?: { width: string; height: string; thickness: string }[];
  lengthPrice?: string;
}

export const AddproductsinitialValues: IProductValues = {
  id: 0, // Default value for id (should be generated dynamically)
  name: '',
  price: 0,
  description: '',
  stock: 0,
  discountPrice: 0,
  AdditionalInformation: [],
  custom_url: '',
  plankWidth: '',
  thickness: '',
  ResidentialWarranty: '',
  CommmericallWarranty: '',
  waterproof: false,
  Meta_Title: '',
  Canonical_Tag: '',
  Meta_Description: '',
  FAQS: [],
  boxCoverage: '',
  products: [],
  colorCode: '',
  colors: [],
  sizes: [],
  lengthPrice: ''
};

export const excludedKeys = [
  'plankWidth',
  'boxCoverage',
  'CommmericallWarranty',
  'spacification',
  'ResidentialWarranty',
  'waterproof',
  'thickness',
  'subcategory',
  'featureImages',
  'colors'
];

export const AddProductvalidationSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').required('Product Name is Required'),
  description: Yup.string().required('Description is  Required'),
  custom_url: Yup.string().required('Custom Url is Required'),
  price: Yup.number()
    .min(1, 'Minimum sales price must be at least 1')
    .required('Required'),
  discountPrice: Yup.number().nullable()
});

export const Appointmentlocation = [
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Abu Dhabi', label: 'Abu Dhabi' },
  { value: 'Al Ain', label: 'Al Ain' },
  { value: 'Sharjah', label: 'Sharjah' },
  { value: 'Umm Al Quwain', label: 'Umm Al Quwain' },
  { value: 'Ajman', label: 'Ajman' },
  { value: 'Ras Al Khaimah', label: 'Ras Al Khaimah' },
  { value: 'Fujairah', label: 'Fujairah' },
  { value: 'Khor Fakkan', label: 'Khor Fakkan' },
  { value: 'Kalba', label: 'Kalba' },
  { value: 'Dibba Al Hisn', label: 'Dibba Al Hisn' },
  { value: 'Dibba Al Fujairah', label: 'Dibba Al Fujairah' },
  { value: 'Al Dhaid', label: 'Al Dhaid' },
  { value: 'Mina Jebel Ali', label: 'Mina Jebel Ali' },
  { value: 'Hatta', label: 'Hatta' },
  { value: 'Al Ruwais Industrial City', label: 'Al Ruwais Industrial City' },
  { value: 'Shaam', label: 'Shaam' },
  { value: 'Madinat Zayed', label: 'Madinat Zayed' },
  { value: 'Masfut', label: 'Masfut' },
  { value: 'Al Bithnah', label: 'Al Bithnah' },
  { value: 'Al Manama', label: 'Al Manama' },
  { value: 'Aasmah', label: 'Aasmah' },
  { value: 'Al Sila', label: 'Al Sila' },
  { value: 'Al Jazeera Al Hamra', label: 'Al Jazeera Al Hamra' },
  { value: 'Masafi', label: 'Masafi' },
  { value: 'Ghayl', label: 'Ghayl' },
  { value: 'Al Huwailat', label: 'Al Huwailat' },
  { value: 'Hay Al Zubara', label: 'Hay Al Zubara' },
  { value: 'Al Badiyah', label: 'Al Badiyah' },
  { value: 'Ghiyathi', label: 'Ghiyathi' },
  { value: 'Al Hamraniah', label: 'Al Hamraniah' },
  { value: 'Al Jeer', label: 'Al Jeer' },
  { value: 'Al Raafah', label: 'Al Raafah' },
  { value: 'Al Batayih', label: 'Al Batayih' },
  { value: 'Al Hail', label: 'Al Hail' },
  { value: 'Adhen Village', label: 'Adhen Village' },
  { value: 'Milehah', label: 'Milehah' },
  { value: 'Al Aweer', label: 'Al Aweer' },
  { value: 'Khatt', label: 'Khatt' },
  { value: 'Al Faqa', label: 'Al Faqa' },
  { value: 'Lahbab', label: 'Lahbab' },
  { value: 'Sweihan', label: 'Sweihan' },
  { value: 'Al Mirfa', label: 'Al Mirfa' },
  { value: 'Al Rams', label: 'Al Rams' },
  { value: 'Al Halah', label: 'Al Halah' },
  { value: 'Qur', label: 'Qur' },
  { value: 'Al Digdaga', label: 'Al Digdaga' },
  { value: 'Ghalilah', label: 'Ghalilah' }
];

export const FindUs = [
  { value: 'Google', label: 'Google' },
  { value: 'Tiktok', label: 'Tiktok' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Friends', label: 'Friends' },
  { value: 'ReturningCustomer', label: 'Returning Customer' },
  { value: 'Radio', label: 'Radio' },
  { value: 'Other', label: 'Other' }
];

export const heroItems: HeroItem[] = [
  {
    offerText: 'Limited Time Offer',
    highlight: '',
    description:
      'We offer premium-quality flooring solutions at factory-direct prices, with express (1 working day) and standard (2-3 days) delivery options.',
    buttonText: 'EXPLORE PRODUCTS',
    buttonLink: '/collections',
    flooringType: 'SPC Eco • American Walnut',
    brand: 'Polar Flooring'
  }
];

export const featureItems = [
  {
    title: 'Free Samples',
    description:
      'Order up to 5 free samples delivered anywhere in the UAE so you can see and feel the quality before you buy.',
    icon: '/assets/images/Home/freee.png',
    buttonText: 'Learn More',
    buttonLink: '/free-sample'
  },
  {
    title: 'Easy payment',
    description:
      'With Tabby or Tamara, split your payment into four easy installments — no hassle, no hidden fees.',
    icon: '/assets/images/Home/card.png',
    buttonText: 'Learn More',
    buttonLink: '/easy-payment'
  },
  {
    title: 'Delivery',
    description:
      'Choose Express for a small fee for next-day delivery, or enjoy standard delivery in just 2-3 days anywhere in the UAE.',
    icon: '/assets/images/Home/truck.png',
    buttonText: 'Learn More',
    buttonLink: '/shipping-policy'
  },
  {
    title: 'Factory Prices',
    description:
      'No middlemen, just high-quality flooring at factory - direct prices. Best value without compromise.',
    icon: '/assets/images/Home/factory.png'
  }
];

export const socialLinks: SocialLink[] = [
  {
    href: 'https://www.facebook.com/easyfloorsuae',
    target: '_blank',
    alt: 'facebook',
    className: 'w-[6px] h-[9px] sm:w-[8px] sm:h-[15px]'
  },
  {
    href: 'https://www.instagram.com/easyfloorsuae/?hl=en',
    target: '_blank',
    alt: 'instagram',
    className: 'w-[10px] h-[10px] sm:w-[16px] sm:h-[16px]'
  },
  {
    href: 'https://www.pinterest.com/easyfloorsuae/',
    target: '_blank',
    alt: 'pinterest',
    className: 'w-[8px] h-[11px] sm:w-[12px] sm:h-[16px]'
  }
];

export const staticMenuItems = [
  { label: 'SPC Flooring', href: 'spc-flooring', submenu: [] },
  { label: 'LVT Flooring', href: 'lvt-flooring', submenu: [] },
  { label: 'Richmond Flooring', href: 'richmond-flooring', submenu: [] },
  { label: 'Polar Flooring', href: 'polar-flooring', submenu: [] },
  { label: 'How to measure', href: 'how-to-measure-your-room' },
  { label: 'Accessories', href: 'accessories', submenu: [] },
  // { label: "Blogs", href: "blogs" },
  { label: 'About Us', href: 'about-us' },
  { label: 'Contact Us', href: 'contact-us' }
];

export const features: Feature[] = [
  {
    icon: '/assets/categoryslider/leftrightarrow.png',
    label: '125mm',
    width: 25,
    height: 25
  },
  {
    icon: '/assets/categoryslider/upbottomarrow.png',
    label: '10mm',
    width: 10,
    height: 20
  },
  {
    icon: '/assets/categoryslider/againupbottom.png',
    label: '300-1200mm',
    width: 5,
    height: 20
  }
];

export const footerData = {
  company: {
    name: 'easy floors',
    description:
      'Founded with a passion for quality and design. Easyfloors is all about top-notch quality, happy customers, and awesome deals.'
  },
  contact: {
    address:
      'Easy Floors - Floorings · 22nd 15B St - Al Quoz - Al Quoz Industrial Area 4 - Dubai',
    phone: '+971 50 597 4385',
    email: 'cs@easyfloors.ae'
  },
  paymentMethods: [
    'visa',
    'apple-pay',
    'tabby',
    'mastercard',
    'g-pay',
    'tamara'
  ]
};
export const blocksData = [
  {
    heading: 'SPC Flooring',
    points: [
      'UV layer that protects against fading and surface wear.',
      'Wear layer that is transparent and highly resistant to damage.',
      'A click-lock system is integrated into its installation structure.',
      'Decorative layer with high-resolution wood or stone designs.',
      'The core layer is made from rigid stone polymer composite material.',
      'A base layer that adds foundational stability and durability.'
    ],
    imageUrl:
      'https://res.cloudinary.com/dmmeqgdhv/image/upload/v1742291723/layer1_11zon_dfk4er.webp'
  },
  {
    heading: 'LVT Flooring',
    points: [
      'Protective UV coating that prevents discolouration and wear.',
      'Durable wear layer that provides scratch and scuff resistance.',
      'Authentic printed decor layer that mimics natural textures.',
      'Middle stability layer that provides flexibility and structure.',
      'Bottom vinyl layer that enhances resilience and overall strength.',
      'The click-lock system uses floating installation method. '
    ],
    imageUrl:
      'https://res.cloudinary.com/dmmeqgdhv/image/upload/v1742291706/layers2_11zon_zatjqm.webp'
  }
];
export const FloorItemsData = [
  {
    id: 1,
    title: 'Herringbone Floor',
    imageUrl: '/assets/images/Home/Herringbone.webp',
    hoverImage: '/assets/images/Home/HerringboneHover.webp'
  },
  {
    id: 2,
    title: 'Eco Floor',
    imageUrl: '/assets/images/Home/Eco.webp',
    hoverImage: '/assets/images/Home/EcoHover.webp'
  },
  {
    id: 3,
    title: 'Prime Floor',
    imageUrl: '/assets/images/Home/Prime.webp',
    hoverImage: '/assets/images/Home/PrimeHover.webp'
  }
];

export const categoriesFeatures: CategoryFeatures[] = [
  {
    name: 'Richmond SPC Eco',
    features: [
      'Hottest selling collection',
      'Ideal for large projects',
      'Most affordable',
      'Scratch/water resistant',
      '1220 x 183 x 4mm'
    ]
  },
  {
    name: 'Richmond LVT Comfort',
    features: [
      'Affordable luxury',
      'Free underlay with all Polar',
      '5 year residential warranty',
      'Water resistant',
      '640 x 128 x 4mm'
    ]
  },
  {
    name: 'Richmond LVT Luxury',
    features: [
      'Affordable collection',
      'Perfect for kitchen and kids areas',
      'Natural wood finishes',
      'Free underlay with all Polar',
      '1220 x 180 x 4mm'
    ]
  },
  {
    name: 'Richmond SPC Prime',
    features: [
      'IXPE attached underlay',
      'Click system',
      'No gaps installation',
      '1220 x 183 x 4mm'
    ]
  },
  {
    name: 'Richmond SPC Herringbone',
    features: [
      'Oversize planks like real wood',
      'Click system for easy-fitting',
      'Long lasting, easy maintanence',
      'Water resistant',
      '1220 x 228 x 6.5mm'
    ]
  },
  {
    name: 'Polar SPC Herringbone',
    features: [
      'IXPE underlay',
      '15 year residential warranty',
      'Scratch resistant',
      '640 x 128mm planks',
      '5.5mm thickness'
    ]
  },
  {
    name: 'Polar LVT',
    features: [
      'Water-resistant',
      'Cushioned feel',
      '15 year residential warranty',
      'Slip resistant1220 X 180mm x 5mm thick'
    ]
  },
  {
    name: 'Polar SPC',
    features: [
      'Easy-clean technology',
      'No shrinking/expansion',
      'Water resistant',
      'Wider luxury plank',
      '1220 X 228mm'
    ]
  }
];

export const categoryData: TCategoryData = {
  title: 'What Am I?',
  subtitle: '(Compare us)',
  backgroundImage: '/assets/category/campare-us.png'
};
export const HomeUserInfo = [
  {
    title: 'Budget Friendly',
    description:
      "High-quality flooring doesn't have to cost a fortune. Our durable, stylish options are available at factory prices so you can enjoy premium designs for a fraction of the cost. Stylish and affordable flooring without compromising quality.",
    image:
      'https://res.cloudinary.com/dmmeqgdhv/image/upload/v1744438022/budget_11zon_icozkb.webp',
    icon: '/assets/images/UserInfo/budget-icon.png',
    reverse: true,
    href: 'about-us'
  },
  {
    title: 'Install On Any Flat Surface',
    description:
      'Skip the hassle of removing old floors. You can install our flooring directly over most existing surfaces, saving time, effort, and money on installation. A smooth transition with minimal disruption.',

    image:
      'https://res.cloudinary.com/dmmeqgdhv/image/upload/v1744438070/Overlay_Ready_iaqqwr.webp',
    icon: '/assets/images/UserInfo/overlay-icon.png',
    reverse: false
  }
];

export const policySections = [
  {
    title:
      'Can I Return A Purchased Product From easyfloors.ae, If I Have A Change of Mind?',
    content: [
      'Yes, You can return any item within 7 days of receiving your order if it is unused, and in its original packing.',
      'Begin a return simply by emailing our friendly customer service team at <a href="mailto:cs@easyfloors.ae" target="_blank" class="font-bold">cs@easyfloors.ae</a> with your order number and a 2-3 sentence explanation of why you’re returning an item.',
      "We'll get back to you within 24 hours, and we'll give you a return authorisation number (RAN) that you need to include with the package when you send it back to be processed.",
      "Once we get and accept your return, we'll send you your money back. It could take a few days to show up in your account, but we'll start the return process right away."
    ]
  },
  {
    title: 'What Should I Do If I Receive A Defective Item?',
    content: [
      'If we send you a faulty set, please adhere to the above instructions. You need to enter in the subject line of the email “Defective – Order Number”. We shall respond to your request promptly and offer a substitute for the order.',
      'We understand that if there is an issue with the installation of an item, it will remain unused. For this, you can write to us at <a href="mailto:cs@easyfloors.ae" class="font-bold" target="_blank">cs@easyfloors.ae</a> and we will arrange for one of our skilled representatives to visit the site.'
    ]
  },
  {
    title: 'Who Pays For Return Shipping?',
    content: [
      'If you want to return an item you purchased from us, you will need to pay for the return shipping unless the item is faulty or we sent you the wrong order.',
      'We recommend using a trackable shipping method so we can track the package with you and easyfloors.ae as it comes to you. This will ensure the product gets back to you on time. If the item gets lost or the courier drops it, we can’t help and won’t refund.',
      ' • Items That Are Final Sale',
      ' • Items available during the sale and promotion period',
      ' • Items not in pristine condition, worn or damaged'
    ]
  },
  {
    title: 'Refund Process',
    content: [
      'Once the product has reached our warehouse, we will initiate the refund. The mode of payment will determine how we process the refund: If you paid by card, the refund will be credited back to the same card within four working days after the product is received.',
      "Once we complete the refund process, the duration taken for the funds to reflect in your account will depend on your bank's processing policies. If you need to follow up with your bank or card provider, we will inform you when all actions on our site are completed.",
      'If the payment was made in cash, then the refund will be processed through bank deposit or transfer as soon as we receive the required information from you.'
    ]
  },
  {
    title: 'Get in Touch',
    content: [
      'Have questions about our return and refund policy? Reach out to us at cs@easyfloors.ae. Our customer service team is here to help from 9 am to 6 pm, Monday to Saturday (except on public holidays).',
      'Thanks for shopping with <a href="/" class="font-bold" target="_blank">easyfloors.ae</a>.'
    ]
  }
];

export const faqs: FAQItem[] = [
  {
    id: 1,
    question: 'Do I need underlay for click-lock flooring?',
    answer:
      "The underlay is built into our Richmond flooring, and we will provide it free of charge for our Polar range to add comfort and reduce sound. An underlay can help improve a floor's sound insulation and give it a smoother look and feel."
  },
  {
    id: 2,
    question: "What are the best types of flooring for Dubai's climate?",
    answer:
      'High temperatures and humidity in Dubai make SPC and LVT flooring ideal. These types of flooring are water-resistant, durable, and won’t warp or expand due to temperature changes.'
  },
  {
    id: 3,
    question: 'How do I know which flooring material is best for my space?',
    answer: `<p>The right flooring material depends on the room’s use, foot traffic, and moisture levels. SPC is durable, LVT is comfortable and stylish, and Herringbone patterns add a decorative touch. If unsure, talk to our experts at the click of a button by <a href='https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER?.replace('+', '').replace(/\s+/g, '')}' target='_blank' class='font-semibold text-primary hover:underline'>WhatsApp</a>.</p>`
  }
];

export const boxData: BoxData[] = [
  {
    title: 'Need help with measurement?',
    description: `We have a detailed How to Measure Guide to make it easy. If you need further assistance, feel free to contact us—we're here to help!`,
    buttonText: 'Book Your Appointment',
    icon: '/assets/images/Home/measure1.png',
    link: '/measurement-appointment',
    bgImage: '/assets/images/Home/measure.webp'
  },
  {
    title: 'Need help with installation?',
    description: `Our easy click-lock system makes installation simple—no glue or nails are required. If self-fitting isn’t your thing, let us take care of the hassle. One call or message and we’ll send our expert teams to take care of the installation.`,
    buttonText: 'Book Your Appointment',
    icon: '/assets/images/Home/Vectorrg.png',
    link: '/help-with-installations',
    bgImage: '/assets/images/Home/install.webp'
  }
];

export const popupCards: CardData[] = [
  {
    id: 6,
    heading: 'Polar <br /> SPC Eco',
    content: [
      'Lots of timeless styles',
      'Wood grain finishes',
      'Water-resistant',
      "Affordable from <span class='font-currency font-normal md:text-18'></span> 49.00",
      'Modern and classic'
    ]
  },

  {
    id: 8,
    heading: 'Polar <br /> LVT Comfort',
    content: [
      'Wood-like textured finish',
      'Durable with 0.3mm wear layer',
      '1220mm x 180mm plank size',
      'Up to 5-year warranty',
      '15-year warranty'
    ]
  },
  {
    id: 1,
    heading: 'Richmond <br /> SPC Eco',
    content: [
      'Integrated IXPE underlay',
      'SPC core construction',
      'Realistic Wood Grain Finish',
      "Affordable price from <span class='font-currency font-normal md:text-18'></span> 109",
      'DIY-friendly installation'
    ]
  },
  {
    id: 2,
    heading: 'Richmond <br /> SPC Prime',
    content: [
      'Premium designs',
      'Acoustic IXPE underlay',
      'Longer Planks for a more authentic wood finish',
      'A wide range of natural finishes',
      'Durable & water-resistant'
    ]
  },
  {
    id: 3,
    heading: 'Richmond SPC <br /> Herringbone',
    content: [
      'Elegant Herringbone pattern',
      'Wide range of colours',
      'Integrated IXPE sound barrier',
      'Durable 0.5mm wear layer',
      'Easy payment options'
    ]
  },
  {
    id: 4,
    heading: 'Richmond LVT <br /> Comfort',
    content: [
      'Wood-inspired finishes',
      'Durable 0.55mm wear layer',
      'Easy installation',
      'Wide range of colours',
      'Perfect for home or office'
    ]
  },
  {
    id: 5,
    heading: 'Richmond LVT <br /> Luxury',
    content: [
      'Premium, wood-like designs',
      'Scratch and stain-resistant',
      'Extra-wide planks',
      '15-year warranty',
      'Free samples, fast delivery'
    ]
  },
  {
    id: 7,
    heading: 'Polar SPC <br /> Herringbone',
    content: [
      'Herringbone zig-zag pattern',
      'Free underlay on all orders',
      'Wood-like embossed texture',
      'Multi-colour options',
      '0.3mm wear layer'
    ]
  }
];

export const faqspage: FAQ[] = [
  {
    question: 'Can you put SPC flooring on concrete?',
    answer:
      'We often receive this question from our customers. The answer is definitely yes. Stone polymer composite (SPC) looks great on concrete subfloors. By creating a solid foundation, it reduces the possibility of warping or buckling over time. So we have to use a completely flat surface for installation.'
  },
  {
    question:
      'When can you walk on LVT flooring after the installation process?',
    answer:
      'Our planks have a four-side click lock system for easy installation, and you can walk on them right away after the installation process. However, you should wait 48 hours before walking on glue-down LVT flooring textures, although some manufacturers recommend waiting longer.'
  },
  {
    question: 'Is SPC flooring slippery?',
    answer:
      'SPC flooring features a nonslip surface material. Since SPC flooring has a low heat transfer coefficient, it provides excellent anti-skid properties. A few drops of water on SPC flooring will make it feel less slippery than ordinary tile and stone.'
  },
  {
    question: 'Can heavy furniture be placed on oak SPC flooring?',
    answer:
      "Yes. The strong and resilient core layer of oak SPC flooring allows it to support heavy furniture. Compared to thinner choices (3 mm), a thicker SPC core (5 mm or more) is better able to resist dents and warping. Because of its stability, the flooring won't buckle or move even when heavy furniture is placed on it. Further, SPC flooring is more durable and impact-resistant than laminate flooring, making it a better option for spaces with heavy furniture. "
  },
  {
    question: 'Is SPC flooring fireproof?',
    answer:
      'Fire-retardant SPC flooring is capable of withstanding flames and delaying the spread of fire. In some ways, this flooring type has stood the test of time over other types since it has proven to be more resistant to extreme temperatures. '
  },
  {
    question: 'What are the advantages of SPC flooring?',
    answer:
      'The dark or light tone wood grain finish of SPC flooring offers a classic and bold look. SPC floor coverings contain a pre-attached IXPE or EVA foam underlay for sound insulation and a soft underfoot feel. These are used in different residential and commercial buildings. It significantly reduces the need for frequent repairs and replacements as well as guarantees the safety of children.'
  },
  {
    question: 'Can I request samples?',
    answer:
      'Yes! We offer free flooring samples across our full range. Simply add the samples to your basket and checkout. Order up to 5 free samples delivered anywhere in the UAE so you can see and feel the quality before you buy.'
  },
  {
    question: 'Is there a warranty on your products?',
    answer:
      "A luxury vinyl plank flooring manufacturer's warranty varies from product to product and is included with all of our flooring. Our polar products have a two-year commercial warranty and a five-year residential warranty, while our Richmond SPC and LVT floorings have a ten-year domestic warranty and a five-year commercial warranty. "
  },
  {
    question: 'Is oak SPC flooring pet-friendly?',
    answer:
      'All of our durable floors are designed to withstand the rigours of kids and pets. Our flooring is completely free of formaldehyde, ensuring a safe and healthy indoor environment. We also have antibacterial coating on floors that provides excellent antibacterial properties, keeping your space clean and hygienic.'
  },
  {
    question: 'Does Polar LVT flooring fade under sunlight?',
    answer:
      "Our Polar LVT Flooring UAE does not fade under sunlight. We can use them for locations that receive direct sunlight, such as sunrooms or rooms with wide windows. The reason is that it contains UV protection, which prevents fading and discolouration caused by exposure to sunshine. The floors' deep antique tones remained after years of exposure to direct sunlight, giving the spaces an energetic and appealing look."
  },
  {
    question: 'Can I install SPC flooring myself?',
    answer:
      "Yes. SPC flooring is an excellent option for do-it-yourself installation because of its simple 4-side click-lock mechanism. Before beginning, just make sure your subfloor is dry, clean, and level. With basic equipment like a rubber mallet, tape measure, and utility knife, the planks may be easily snapped together without the need for glue or nails. However, if you have any concerns or want a flawless finish, it's always a good idea to contact an expert."
  },
  {
    question: 'Does SPC flooring feel cold?',
    answer:
      "There's nothing better than SPC flooring underfoot, no matter what the weather is like. It is made of stone polymer composite with wear layers, which maintains a neutral temperature in summer and a slight warmth in winter to retain heat. The warmth of this flooring makes stepping out of bed in a bedroom more comfortable than stepping on cold tiles. In homes with kids or older adults who may be sensitive to extreme temperatures, this feature is really handy."
  },
  {
    question: 'Can I use SPC flooring in the bathroom?',
    answer:
      "Of course. Because SPC flooring is water-resistant, it's a great option for bathrooms. It is resistant to warping, swelling, and moisture damage, unlike laminate or conventional wood. Even in regions with high humidity, its strong core and protective outer shell offer exceptional longevity. Selecting textured SPC planks will increase safety by preventing slippage in damp areas."
  },
  {
    question: 'Is SPC or LVT flooring suitable for UAE climates?',
    answer:
      "Yes. The UAE's humid and hot atmosphere is something that our Richmond SPC or LVT flooring is made to resist. It is a dependable option for both residential and commercial applications because of its heat- and water-resistant qualities. SPC and LVT provide long-term durability since they do not expand or contract in response to temperature variations like regular wood flooring does. "
  }
];

export const alternatingData: TAboutUs[] = [
  {
    id: 1,
    image: '/assets/images/aboutus/about2.webp',
    alt: 'First Image',
    heading: 'Your Trusted Online Flooring Store',
    paragraph:
      "We’re the leading online flooring store in the UAE, offering our valued customers top-quality products from the Richmond and Polar collections. With years of experience, we've earned a solid reputation for being reliable, efficient, and customer satisfaction-centric. Our Jebel Ali warehouse in Dubai holds 60,000 sqm of stock, so we can deliver fast anywhere in the UAE."
  },
  {
    id: 2,
    image: '/assets/images/aboutus/about3.webp',
    alt: 'Second Image',
    heading: 'For Homes And Businesses In The UAE',
    paragraph:
      'We cater to a range of customers, including homeowners, commercial properties like schools and offices, flooring contractors, and interior designers. With a direct factory connection and years of hands-on experience, we’ve designed our flooring materials to handle the tough climate of Dubai and the UAE'
  },
  {
    id: 3,
    image: '/assets/images/aboutus/third.webp',
    alt: 'Third Image',
    heading: 'Why Choose Easy Floors',
    paragraph:
      'At Easy Floors, we understand that choosing the right flooring is a big decision. We offer many premium options to fit any space and budget, along with a 15-year residential and 5-year commercial warranty enabling you to choose with confidence. Our focus on quality, transparency, and customer satisfaction sets us apart.'
  }
];

export const sampleGridData: SampleGridData[] = [
  {
    id: 1,
    title: 'Try Before You Buy',
    description:
      'Order up to 5 free samples, delivered FREE of charge across the UAE to find the perfect match.',
    buttonText: 'Order free samples',
    image: '/assets/images/aboutus/order-free-sample.webp',
    alt: 'Free sample order',
    href: 'collections'
  },
  {
    id: 2,
    title: 'Got Questions? Ask Away!',
    description:
      'Contact our friendly support team for expert advice on all your flooring needs.',
    buttonText: 'Request a call back',
    image: '/assets/images/aboutus/request-call-back.png',
    alt: 'Free sample order',
    href: 'contact-us'
  }
];

export const measurementData: MeasurementSection[] = [
  {
    title: 'How to Measure Your Room for Flooring',
    description:
      "Measure your room to ensure that you are purchasing the right amount of flooring. That'll prevent delays, overspending, and shortages. A good measurement will also simplify the installation process and eliminate the need for repeat orders or returns.",
    steps: [],
    image: ''
  },
  {
    title: 'General Guidelines for Measuring Your Room ',
    description: `When calculating the width and length of a rectangular or square area, add 5-10% for waste and cutting errors. If you are planning to construct staircases, mantels, or closets in your room, allocate over 10% of your budget to them. 
      If you would like professional assistance, we can arrange a measuring service for you with a refundable charge of <span class='font-currency font-normal text-18'></span> 150 (refunded if you place an order with us). If you wish to measure the area yourself, you will only need a measuring tape, a pencil, and paper. Make sure you measure in metres if you will be buying flooring materials that are usually marketed in metres.
      `,
    stepsHeading: 'Measuring a Square or Rectangular Room',
    steps: [
      {
        title: 'Measure the length:',
        content: "Find the room's length, such as five metres."
      },
      {
        title: 'Measure the width:',
        content: "Determine the room's width, such as five metres"
      },
      {
        title: 'Measure the total area',
        content:
          'To get the floor size in square metres, multiply the length by the width.'
      }
    ],
    image: '/assets/images/how-to-measure-your-room/measure1.png'
  },
  {
    title: 'Measuring an L-shaped or Irregular Room',
    description:
      'When dealing with uneven areas, divide the area into smaller, more manageable rectangles and measure each one independently. Then, make a rough sketch and draw the room plan.',

    steps: [
      {
        title: 'Measure Every Section',
        content:
          "Take separate measurements of each section's length and width."
      },
      {
        title: 'Determine the total area.',
        content:
          'The length of every part should be multiplied by its width before adding them all together to get the total size of the space.'
      }
    ],
    image: '/assets/images/how-to-measure-your-room/mearuse2.png'
  },

  {
    title: 'Factoring in 10% Waste Allowance',
    description:
      'We highly recommend adding another 5-10% for waste and cutting adjustments to ensure enough flooring. Place your order and prepare for installation!',
    steps: [],
    image: ''
  },

  {
    title: 'Get Expert Guidance from Easy Floors',
    description:
      'With Easy Floors, you have various premium flooring options in Dubai and the United Arab Emirates. If you need additional professional assistance with floor design ideas or flooring recommendations, please email us at cs@easyfloors.ae.',
    steps: [],
    image: ''
  }
];

export const loginData: AuthData = {
  title: 'WELCOME TO <br> EASY FLOORS',
  subtitle: 'Sign In',
  description: 'Please login using account details below.',
  emailPlaceholder: 'Enter your email',
  passwordPlaceholder: 'Enter your password',
  forgotPasswordText: 'Forgot your password?',
  buttonText: 'Sign In',
  footerText: "Don't Have an Account?",
  footerLinkText: 'Create account',
  value: ''
};

export const emirates = [
  { value: 'Abu Dhabi', label: 'Abu Dhabi' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Sharjah', label: 'Sharjah' },
  { value: 'Ajman', label: 'Ajman' },
  { value: 'Umm Al-Quwain', label: 'Umm Al-Quwain' },
  { value: 'Ras Al Khaimah', label: 'Ras Al Khaimah' },
  { value: 'Fujairah', label: 'Fujairah' }
];

export const emirateCityMap: Record<
  string,
  { value: string; label: string }[]
> = {
  'Abu Dhabi': [
    { value: 'Abu Dhabi', label: 'Abu Dhabi' },
    { value: 'Al Reem Island', label: 'Al Reem Island' },
    { value: 'Yas Island', label: 'Yas Island' },
    { value: 'Saadiyat Island', label: 'Saadiyat Island' },
    { value: 'Al Khalidiyah', label: 'Al Khalidiyah' },
    { value: 'Corniche', label: 'Corniche' },
    { value: 'Al Bateen', label: 'Al Bateen' },
    { value: 'Al Raha Beach', label: 'Al Raha Beach' },
    { value: 'Danet', label: 'Danet' },
    { value: 'Zayed City', label: 'Zayed City' },
    { value: 'Al Maryah Island', label: 'Al Maryah Island' },
    { value: 'Hamdan Street', label: 'Hamdan Street' },
    { value: 'AlJurf', label: 'AlJurf' },
    { value: 'Saadiyat Grove', label: 'Saadiyat Grove' },
    { value: 'Al Zahiyah', label: 'Al Zahiyah' },
    { value: 'Al Markaziya', label: 'Al Markaziya' },
    { value: 'Al Ghadeer Village', label: 'Al Ghadeer Village' },
    { value: 'Electra Street', label: 'Electra Street' },
    { value: 'Al Mushrif', label: 'Al Mushrif' },
    { value: 'Capital Centre', label: 'Capital Centre' },
    { value: 'Masdar City', label: 'Masdar City' },
    { value: 'Airport Road', label: 'Airport Road' },
    { value: 'Khalifa City', label: 'Khalifa City' },
    { value: 'Marina Island', label: 'Marina Island' },
    { value: 'Al Mina', label: 'Al Mina' },
    { value: 'Al Rawdah', label: 'Al Rawdah' },
    { value: 'Al Maqtaа', label: 'Al Maqtaа' },
    { value: 'Al Nahyan', label: 'Al Nahyan' },
    { value: 'Ghantoot', label: 'Ghantoot' },
    { value: 'Nurai Island', label: 'Nurai Island' },
    { value: 'Abu Dhabi Gate City', label: 'Abu Dhabi Gate City' },
    { value: 'Eastern Mangrove', label: 'Eastern Mangrove' },
    { value: 'Hudayriyat Island', label: 'Hudayriyat Island' },
    { value: 'Makers District', label: 'Makers District' },
    { value: 'Yas Bay', label: 'Yas Bay' },
    { value: 'Al Shamkha', label: 'Al Shamkha' },
    { value: 'Al Gurm Resort', label: 'Al Gurm Resort' },
    { value: 'Al Matar', label: 'Al Matar' },
    { value: 'Musaffah', label: 'Musaffah' },
    { value: 'Al Wahdah', label: 'Al Wahdah' },
    { value: 'Zayed Sports City', label: 'Zayed Sports City' },
    { value: 'Al Najda Street', label: 'Al Najda Street' },
    { value: 'Rawdhat', label: 'Rawdhat' },
    { value: 'Al Aman', label: 'Al Aman' },
    { value: 'Al Qurm', label: 'Al Qurm' },
    { value: 'Al Khubeirah', label: 'Al Khubeirah' },
    { value: 'Al Kasir Island', label: 'Al Kasir Island' },
    { value: 'Between Two Bridges', label: 'Between Two Bridges' },
    { value: 'Ramhan Island', label: 'Ramhan Island' },
    { value: 'Al Raha Gardens', label: 'Al Raha Gardens' },
    { value: 'Mohammed Bin Zayed City', label: 'Mohammed Bin Zayed City' },
    { value: 'Al Danah', label: 'Al Danah' },
    { value: 'Wahat Al Zaweya', label: 'Wahat Al Zaweya' },
    { value: 'Nareel Island', label: 'Nareel Island' },
    { value: 'Grand Mosque District', label: 'Grand Mosque District' },
    { value: 'Shakhbout City', label: 'Shakhbout City' },
    { value: 'Lulu Island', label: 'Lulu Island' }
  ],
  Dubai: [
    { value: 'Downtown', label: 'Downtown' },
    { value: 'Business Bay', label: 'Business Bay' },
    { value: 'Dubai Marina', label: 'Dubai Marina' },
    { value: 'Palm Jumeirah', label: 'Palm Jumeirah' },
    { value: 'Emaar Beachfront', label: 'Emaar Beachfront' },
    { value: 'MBR City - Meydan', label: 'MBR City - Meydan' },
    { value: 'Dubai Creek Harbour', label: 'Dubai Creek Harbour' },
    { value: 'Dubai Hills Estate', label: 'Dubai Hills Estate' },
    { value: 'Damac Hills', label: 'Damac Hills' },
    { value: 'Damac Hills II ( Akoya )', label: 'Damac Hills II ( Akoya )' },
    { value: 'Al Barsha', label: 'Al Barsha' },
    { value: 'Al Furjan', label: 'Al Furjan' },
    { value: 'Al Ghadeer', label: 'Al Ghadeer' },
    { value: 'Al Habtoor City', label: 'Al Habtoor City' },
    { value: 'Al Jaddaf', label: 'Al Jaddaf' },
    { value: 'Al Marjan Island', label: 'Al Marjan Island' },
    { value: 'Al Reem Island', label: 'Al Reem Island' },
    { value: 'Al Safa', label: 'Al Safa' },
    { value: 'Alreeman', label: 'Alreeman' },
    { value: 'Arabian Ranches', label: 'Arabian Ranches' },
    { value: 'Arjan - Dubailand', label: 'Arjan - Dubailand' },
    { value: 'Bluewaters Island', label: 'Bluewaters Island' },
    { value: 'City Walk', label: 'City Walk' },
    {
      value: 'DHCC - Dubai Healthcare City',
      label: 'DHCC - Dubai Healthcare City'
    },
    { value: 'DMC - Dubai Maritime City', label: 'DMC - Dubai Maritime City' },
    { value: 'DSO - Dubai Silicon Oasis', label: 'DSO - Dubai Silicon Oasis' },
    { value: 'Damac Lagoons', label: 'Damac Lagoons' },
    {
      value: 'Dubai Design District (d3)',
      label: 'Dubai Design District (d3)'
    },
    { value: 'Dubai Harbour', label: 'Dubai Harbour' },
    { value: 'Dubai Islands', label: 'Dubai Islands' },
    {
      value: 'Dubai Production City | IMPZ',
      label: 'Dubai Production City | IMPZ'
    },
    { value: 'Dubai South', label: 'Dubai South' },
    { value: 'Dubai Sports City', label: 'Dubai Sports City' },
    { value: 'Dubai Studio City', label: 'Dubai Studio City' },
    { value: 'Dubailand', label: 'Dubailand' },
    { value: 'Emirate of Abu Dhabi', label: 'Emirate of Abu Dhabi' },
    { value: 'Emirate of Ajman', label: 'Emirate of Ajman' },
    { value: 'Emirate of Ras Al Khaimah', label: 'Emirate of Ras Al Khaimah' },
    { value: 'Emirate of Sharjah', label: 'Emirate of Sharjah' },
    { value: 'Hayat Island', label: 'Hayat Island' },
    {
      value: 'JBR - Jumeirah Beach Residence',
      label: 'JBR - Jumeirah Beach Residence'
    },
    {
      value: 'JLT - Jumeirah Lake Towers',
      label: 'JLT - Jumeirah Lake Towers'
    },
    {
      value: 'JVC - Jumeirah Village Circle',
      label: 'JVC - Jumeirah Village Circle'
    },
    {
      value: 'JVT - Jumeirah Village Triangle',
      label: 'JVT - Jumeirah Village Triangle'
    },
    { value: 'Jebel Ali Village', label: 'Jebel Ali Village' },
    { value: 'Jumeirah', label: 'Jumeirah' },
    { value: 'Jumeirah Pearl', label: 'Jumeirah Pearl' },
    { value: 'Liwan', label: 'Liwan' },
    { value: 'Maryam Island', label: 'Maryam Island' },
    {
      value: 'MJL - Madinat Jumeirah Living',
      label: 'MJL - Madinat Jumeirah Living'
    },
    { value: 'Meadows', label: 'Meadows' },
    { value: 'Motor City', label: 'Motor City' },
    { value: 'Mudon', label: 'Mudon' },
    { value: 'Nad Al Sheba', label: 'Nad Al Sheba' },
    { value: 'Saadiyat Island', label: 'Saadiyat Island' },
    { value: 'Sobha Hartland', label: 'Sobha Hartland' },
    { value: 'Sobha Hartland 2', label: 'Sobha Hartland 2' },
    { value: 'The Valley', label: 'The Valley' },
    { value: 'Tilal Al Ghaf', label: 'Tilal Al Ghaf' },
    { value: 'Town Square', label: 'Town Square' },
    { value: 'World Islands', label: 'World Islands' },
    { value: 'Yas Island', label: 'Yas Island' },
    { value: "Za'abeel", label: "Za'abeel" },
    { value: 'Zayed City', label: 'Zayed City' }
  ],
  Sharjah: [
    { value: 'Sharjah', label: 'Sharjah' },
    { value: 'Khor Fakkan', label: 'Khor Fakkan' },
    { value: 'Kalba', label: 'Kalba' },
    { value: 'Dibba Al-Hisn', label: 'Dibba Al-Hisn' },
    { value: 'Al Dhaid', label: 'Al Dhaid' },
    { value: 'Al Madam', label: 'Al Madam' },
    { value: 'Al Bataeh', label: 'Al Bataeh' },
    { value: 'Mleiha', label: 'Mleiha' },
    { value: 'Nahwa', label: 'Nahwa' },
    { value: 'Al Hamriyah', label: 'Al Hamriyah' },
    { value: 'Wadi Shi', label: 'Wadi Shi' }
  ],
  Ajman: [
    { value: 'Ajman', label: 'Ajman' },
    { value: 'Masfout', label: 'Masfout' },
    { value: 'Manama', label: 'Manama' }
  ],
  'Umm Al-Quwain': [
    { value: 'Umm Al Quwain', label: 'Umm Al Quwain' },
    { value: 'Falaj Al Mualla', label: 'Falaj Al Mualla' }
  ],
  'Ras Al Khaimah': [
    { value: 'Ras Al Khaimah', label: 'Ras Al Khaimah' },
    { value: 'Al Rams', label: 'Al Rams' },
    { value: "Sha'am", label: "Sha'am" },
    { value: 'Digdaga', label: 'Digdaga' },
    { value: 'Ghalilah', label: 'Ghalilah' },
    { value: 'Khatt', label: 'Khatt' },
    { value: 'Al Jeer', label: 'Al Jeer' },
    { value: 'Adhen', label: 'Adhen' },
    { value: 'Khor Khwair', label: 'Khor Khwair' },
    { value: 'Al Qusaidat', label: 'Al Qusaidat' },
    { value: 'Ghayl', label: 'Ghayl' },
    { value: 'Al Hamraniyah', label: 'Al Hamraniyah' }
  ],
  Fujairah: [
    { value: 'Fujairah', label: 'Fujairah' },
    { value: 'Dibba Al-Fujairah', label: 'Dibba Al-Fujairah' },
    { value: 'Masafi', label: 'Masafi' },
    { value: 'Mirbah', label: 'Mirbah' },
    { value: 'Qidfa', label: 'Qidfa' },
    { value: 'Al Badiyah', label: 'Al Badiyah' },
    { value: 'Dadna', label: 'Dadna' }
  ]
};
