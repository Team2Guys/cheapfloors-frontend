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
  area: Yup.string().required('Location is required'),
  selectRooms: Yup.string().required('Area is required'),
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
    icon: '/assets/images/Home/sample.png',
    buttonText: 'Learn More',
    buttonLink: '/free-sample'
  },
  {
    title: 'Easy Payment',
    description:
      'With Tabby or Tamara, split your payment into four easy installments — no hassle, no hidden fees, Shariah compliant. Get premium flooring today while managing your budget comfortably.',
    icon: '/assets/images/Home/payment-icon.png',
    buttonText: 'Learn More',
    buttonLink: '/easy-payment'
  },
  {
    title: 'Delivery',
    description:
      'Choose Express for a small fee for next-day delivery, or enjoy standard delivery in just 2-3 days anywhere in the UAE.',
    icon: '/assets/images/Home/car.png',
    buttonText: 'Learn More',
    buttonLink: '/shipping-policy'
  },
  {
    title: 'Factory Prices',
    description:
      'No middlemen, just high-quality flooring at factory-direct prices. Easy Floors is among the most trusted flooring companies in Dubai, offering the best value without compromise.',
    icon: '/assets/images/Home/factory-icon.png'
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
  { label: 'Floor Smart', href: 'floor-smart', submenu: [] },
  { label: 'How to measure', href: 'how-to-measure-your-room' },
  { label: 'Accessories', href: 'accessories', submenu: [] },
  // { label: "Blogs", href: "blogs" },
  // { label: 'About Us', href: 'about-us' },
  // { label: 'Contact Us', href: 'contact-us' }
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
    heading: 'SPC',
    points: [
      'Protective UV top coating helps guard against fading, stains, and everyday surface wear.',
      'A rigid support core provides excellent stability and long-lasting durability.',
      'Durable transparent wear layer resists scratches, scuffs, and daily foot traffic.',
      'Click-lock installation system allows quick, secure, and hassle-free fitting.',
      'Available in 38 stylish wood-inspired colours and finishes to match modern interiors.',
      'High-definition decorative layer replicates the beauty of natural wood and stone.',
      'SPC ranges available: Polar Eco & Herringbone, Richmond Eco, Prime & Herringbone.',
    ],
    imageUrl:
      '/assets/images/Home/layers_2.webp'
  },
  {
    heading: 'LVT',
    points: [
      '36+ elegant wood-effect colour options designed to complement contemporary spaces.',
      'UV-resistant surface layer helps protect colour and maintain the floor’s appearance.',
      'Strong wear layer built to withstand scratches, scuffs, and daily use.',
      'Realistic printed décor layer recreates the texture and detail of natural materials.',
      'Flexible stabilising core ensures strength while maintaining comfort underfoot.',
      'Durable vinyl backing layer enhances stability and impact resistance.',
      'LVT ranges available: Polar LVT Comfort, Richmond LVT Comfort, and Luxury.',
    ],
    imageUrl:
      '/assets/images/Home/layers_1.webp'
  }
];
export const FloorItemsData = [
  {
    id: 1,
    title: 'Herringbone Floor',
    imageUrl: '/assets/images/Home/herring-new.webp',
    hoverImage: '/assets/images/Home/herring-new.webp'
  },
  {
    id: 2,
    title: 'Eco Floor',
    imageUrl: '/assets/images/Home/Eco-new.webp',
    hoverImage: '/assets/images/Home/Eco-new.webp'
  },
  {
    id: 3,
    title: 'Prime Floor',
    imageUrl: '/assets/images/Home/Prime-new.webp',
    hoverImage: '/assets/images/Home/Prime-new.webp'
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
  },
  {
    name: 'Floor Smart SPC Eco',
    features: [
      'Eco-friendly & low VOC',
      'Antifungal & antibacterial protection',
      ' 100% waterproof & fire resistant',
      'Anti-slip surface for safety',
      ' Click system for easy fitting',
      " 1220 x 183 × 5mm"
    ]
  }
];

export const categoryData: TCategoryData = {
  title: 'What Am I?',
  subtitle: '(Compare us)',
  backgroundImage: '/assets/category/compare-us.webp'
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
      'Begin a return simply by emailing our friendly customer service team at <a href="mailto:cs@easyfloors.ae" target="_blank" class="font-normal text-primary">cs@easyfloors.ae</a> with your order number and a 2-3 sentence explanation of why you’re returning an item.',
      "We'll get back to you within 24 hours, and we'll give you a return authorisation number (RAN) that you need to include with the package when you send it back to be processed.",
      "Once we get and accept your return, we'll send you your money back. It could take a few days to show up in your account, but we'll start the return process right away."
    ]
  },
  {
    title: 'What Should I Do If I Receive A Defective Item?',
    content: [
      'If we send you a faulty set, please adhere to the above instructions. You need to enter in the subject line of the email “Defective – Order Number”. We shall respond to your request promptly and offer a substitute for the order.',
      'We understand that if there is an issue with the installation of an item, it will remain unused. For this, you can write to us at <a href="mailto:cs@easyfloors.ae" class="font-normal text-primary" target="_blank">cs@easyfloors.ae</a> and we will arrange for one of our skilled representatives to visit the site.'
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
      'Have questions about our return and refund policy? Reach out to us at <a href="mailto:cs@easyfloors.ae" class="font-normal text-primary" target="_blank">cs@easyfloors.ae</a>. Our customer service team is here to help from 9 am to 6 pm, Monday to Saturday (except on public holidays).',
      'Thanks for shopping with <a href="/" class="font-normal text-primary" target="_blank">easyfloors.ae</a>.'
    ]
  }
];

export const faqs: FAQItem[] = [
  {
    id: 1,
    question: 'What types of flooring does Easy Floors offer?',
    answer:
      "Easy Floors offers a wide range of modern flooring solutions, including SPC, LVT, and stylish herringbone designs. These durable options are perfect for homes and businesses looking for high-quality flooring solutions in Dubai."
  },
  {
    id: 2,
    question: "Can I order flooring samples before making a purchase?",
    answer:
      "Yes, Easy Floors allows customers to order up to five free flooring samples delivered anywhere in the UAE. This helps you evaluate colour, texture, and quality before choosing the perfect flooring."
  },
  {
    id: 3,
    question: 'Do you provide flooring installation services in Dubai?',
    answer: 'We are a supply only service but if you require installation services, we’d be happy to help arrange that for you as well.'
  },
  {
    id: 4,
    question: 'How long does delivery take across the UAE?',
    answer: 'Easy Floors provides fast delivery across the UAE. Standard delivery typically takes two to three working days, while next-day express delivery is available in Dubai for urgent flooring orders.'
  },
  {
    id: 3,
    question: 'Are Easy Floors products suitable for homes and commercial spaces?',
    answer: 'Yes, our flooring products are designed for both residential and commercial environments. Many businesses choose Easy Floors when searching for reliable flooring companies in UAE offering durable and stylish flooring.'
  },
  {
    id: 3,
    question: 'Do Easy Floors products come with a warranty?',
    answer: 'Yes, Easy Floors flooring collections come with reliable warranties, including up to 15 years for residential use and around 5 years for commercial applications, ensuring long-term performance and peace of mind.'
  },
  {
    id: 3,
    question: 'How can I get help choosing the right flooring?',
    answer: 'Our team is always ready to assist you through phone, email, or WhatsApp. As one of the trusted flooring companies in Dubai, we help customers choose the best flooring style for their space and budget.'
  }
];

export const boxData: BoxData[] = [
  {
    title: 'Need help with measurement?',
    description: `We have a detailed How to Measure Guide to make it easy. If you need further assistance, feel free to contact us—we're here to help!`,
    buttonText: 'Book Your Appointment',
    icon: '/assets/images/Home/measure1.png',
    link: '/measurement-appointment',
    bgImage: '/assets/images/aboutus/about5.webp'
  },
  {
    title: 'Need help with installation?',
    description: `Our easy click-lock system makes installation simple—no glue or nails are required. If self-fitting isn’t your thing, let us take care of the hassle. One call or message and we’ll send our expert teams to take care of the installation.`,
    buttonText: 'Book Your Appointment',
    icon: '/assets/images/Home/Vectorrg.png',
    link: '/help-with-installations',
    bgImage: '/assets/images/aboutus/about6.webp'
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
      "Affordable from <span class='font-currency font-normal md:text-18'></span> 55.00",
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
      '5-year commercial warranty',
      '10-year residential warranty'
    ]
  },
  {
    id: 1,
    heading: 'Richmond <br /> SPC Eco',
    content: [
      'Integrated IXPE underlay',
      'SPC core construction',
      'Realistic Wood Grain Finish',
      "Affordable price from <span class='font-currency font-normal md:text-18'></span> 87",
      'DIY-friendly installation'
    ]
  },
  {
    id: 2,
    heading: 'Richmond <br /> SPC Prime',
    content: [
      'Premium designs',
      'Acoustic IXPE underlay',
      'Longer planks for a more authentic wood finish',
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
  },
  {
    id: 9,
    heading: 'Floor Smart SPC <br />  Eco',
    content: [
      'Eco-friendly & low VOC',
      'Antifungal & antibacterial protection',
      '100% waterproof & fire resistant',
      'Anti-slip surface for safety',
      'Click system for easy fitting'
    ]
  }
];

export const faqspage: FAQ[] = [
  {
    question: 'When can you walk on LVT flooring after the installation process?',
    answer:
      'Our planks have a four-sided click-lock system for easy installation, and you can walk on them right away after the installation process. However, you should wait 48 hours before walking on glue-down LVT flooring textures, although some manufacturers recommend waiting longer.',
      category: 'General'
  },
  {
    question: 'Is SPC flooring slippery?',
    answer:
      'SPC flooring features a nonslip surface material. Since SPC flooring has a low heat transfer coefficient, it provides excellent anti-skid properties. A few drops of water on SPC flooring will make it feel less slippery than ordinary tile and stone.',
      category: 'General'
  },
  {
    question: 'Is SPC flooring fireproof?',
    answer:
      'Fire-retardant SPC flooring is capable of withstanding flames and delaying the spread of fire. In some ways, this flooring type has stood the test of time over other types since it has proven to be more resistant to extreme temperatures.',
      category: 'General'
  },
  {
    question: 'What are the advantages of SPC flooring?',
    answer:
      'The dark or light tone wood grain finish of SPC flooring offers a classic and bold look. SPC floor coverings contain a pre-attached IXPE or EVA foam underlay for sound insulation and a soft underfoot feel. These are used in different residential and commercial buildings. It significantly reduces the need for frequent repairs and replacements, as well as guarantees the safety of children.',
      category: 'General'
  },
  {
    question: 'Does SPC flooring feel cold?',
    answer:
      `There's nothing better than SPC flooring underfoot, no matter what the weather is like. It is made of a stone polymer composite with wear layers, which maintains a neutral temperature in summer and a slight warmth in winter to retain heat. The warmth of this flooring makes stepping out of bed in a bedroom more comfortable than stepping on cold tiles. In homes with kids or older adults who may be sensitive to extreme temperatures, this feature is really handy.`,
      category: 'General'
  },
  {
    question: 'Is SPC or LVT flooring suitable for the UAE climate?',
    answer:
      `Yes. The UAE's humid and hot atmosphere is something that our Richmond SPC or LVT flooring is made to resist. It is a dependable option for both residential and commercial applications because of its heat- and water-resistant qualities. SPC and LVT provide long-term durability since they do not expand or contract in response to temperature variations like regular wood flooring does.`,
      category: 'General'
  },
  
  {
    question:
      'How do I measure my room for flooring?',
    answer:
      'To measure your room, use a tape to record the length and width in metres. Multiply these two figures to calculate the total floor area in square metres. This helps you estimate how much flooring material you will need accurately.',
       category: 'Measuring'
  },
  {
    question:
      'How much extra flooring should I order?',
    answer:
      'It’s recommended to add an extra 5–10% to your total flooring requirement. This allowance covers cutting, fitting adjustments, and material waste during installation, helping you avoid shortages and delays in completing your project.',
       category: 'Measuring'
  },
  {
    question:
      'How do I measure an irregular or L-shaped room?',
    answer:
      'For irregular or L-shaped rooms, divide the space into smaller rectangular sections. Measure each section’s length and width separately, calculate their areas, and then add them together to get the total flooring area required.',
       category: 'Measuring'
  },
  {
    question:
      'What tools do I need to measure my room?',
    answer:
      'You only need basic tools such as a measuring tape, a pencil, and paper to measure your room. These simple tools allow you to record accurate dimensions and calculate the required flooring area without needing professional equipment.',
       category: 'Measuring'
  },

   {
    question:
      ' Do you offer a professional measuring service?',
    answer:
      'Yes, we offer a professional measuring service for a refundable fee of AED 150. This amount is deducted when you place an order with us, ensuring accurate measurements and helping you choose the right flooring quantity for your space.',
       category: 'Measuring'
  },

  {
    question: 'Can heavy furniture be placed on oak SPC flooring?',
    answer:
      `Yes. The strong and resilient core layer of oak SPC flooring allows it to support heavy furniture. Compared to thinner choices (3 mm), a thicker SPC core (5 mm or more) is better able to resist dents and warping. Because of its stability, the flooring won't buckle or move even when heavy furniture is placed on it. Further, SPC flooring is more durable and impact-resistant than laminate flooring, making it a better option for spaces with heavy furniture.`,
      category: 'Product'
  },
  
  {
    question: 'Is oak SPC flooring pet-friendly?',
    answer:
      `All of our durable floors are designed to withstand the rigours of kids and pets. Our flooring is completely free of formaldehyde, ensuring a safe and healthy indoor environment. We also have antibacterial coating on floors that provides excellent antibacterial properties, keeping your space clean and hygienic.`,
      category: 'Product'
  },

    {
    question: 'Does Polar LVT flooring fade under sunlight?',
    answer:
      `Our Polar LVT Flooring UAE does not fade under sunlight. We can use them for locations that receive direct sunlight, such as sunrooms or rooms with wide windows. The reason is that it contains UV protection, which prevents fading and discolouration caused by exposure to sunshine. The floors' deep antique tones remained after years of exposure to direct sunlight, giving the spaces an energetic and appealing look.`,
      category: 'Product'
  },

   {
    question: 'Can I use SPC flooring in the bathroom?',
    answer:
      `Of course. Because SPC flooring is water-resistant, it's a great option for bathrooms. It is resistant to warping, swelling, and moisture damage, unlike laminate or conventional wood. Even in regions with high humidity, its strong core and protective outer shell offer exceptional longevity. Selecting textured SPC planks will increase safety by preventing slippage in damp areas.`,
      category: 'Product'
  },
  {
    question: 'Can you put SPC flooring on concrete?',
    answer:
      "We often receive this question from our customers. The answer is definitely yes. Stone polymer composite (SPC) looks great on concrete subfloors. Creating a solid foundation, it reduces the possibility of warping or buckling over time. So we have to use a completely flat surface for installation.",
       category: 'Service'
  },
  {
    question: 'Can I install SPC flooring myself?',
    answer:
      "Yes. SPC flooring is an excellent option for do-it-yourself installation because of its simple 4-side click-lock mechanism. Before beginning, just make sure your subfloor is dry, clean, and level. With basic equipment like a rubber mallet, tape measure, and utility knife, the planks may be easily snapped together without the need for glue or nails. However, if you have any concerns or want a flawless finish, it's always a good idea to contact an expert.",
       category: 'Service'
  },
  {
    question: 'Can I request samples?',
    answer:
      "Yes! We offer free flooring samples across our full range. Simply add the samples to your basket and checkout. Order up to 5 free samples delivered anywhere in the UAE so you can see and feel the quality before you buy.",
       category: 'Service'
  },
   {
    question: 'Is there a warranty on your products?',
    answer:
      "A luxury vinyl plank flooring manufacturer's warranty varies from product to product and is included with all of our flooring. Our polar products have a two-year commercial warranty and a five-year residential warranty, while our Richmond SPC and LVT floorings have a ten-year domestic warranty and a five-year commercial warranty.",
       category: 'Service'
  },
  {
    question: 'How long does delivery take in the UAE?',
    answer:
      'We aim to deliver all orders across the mainland UAE within 2 to 3 working days. Delivery timelines may vary slightly depending on your location, but we strive to ensure a smooth and hassle-free experience from order placement to final delivery.',
       category: 'Delivery'
  },
  {
    question: 'Do you offer express delivery in Dubai?',
    answer:
      'Yes, we offer express delivery within Dubai. Orders placed before the 1pm cut-off time are delivered on the next working day. This service is available for a fee of AED 150, ensuring fast and convenient delivery when you need it urgently.',
       category: 'Delivery'
  },
  {
    question: 'Is delivery free for flooring orders?',
    answer:
      'Standard delivery is free within Dubai and for all other Emirates on orders above AED 2,000. For orders below AED 1,999 outside Dubai, a delivery fee of AED 200 applies, ensuring flexible and cost-effective shipping options.',
       category: 'Delivery'
  },
  {
    question: 'Can I collect my order myself?',
    answer:
      'Yes, you can choose to self-collect your order from our warehouse. Collection is available Monday to Saturday between 9am and 6pm at our Al Quoz Industrial Area 4 location in Dubai, offering a convenient alternative to delivery.',
       category: 'Delivery'
  },
   {
    question: 'Who can I contact for delivery questions?',
    answer:
      'If you have any questions or need clarification about your delivery, you can contact our team at cs@easyfloors.ae. We are always ready to assist you and ensure your order reaches you on time without any complications.',
       category: 'Delivery'
  },
];

export const alternatingData: TAboutUs[] = [
  {
    id: 1,
    image: '/assets/images/aboutus/about1.webp',
    alt: 'First Image',
    heading: 'Your Trusted Online Flooring Store',
    paragraph:
      "We’re the leading online flooring store in the UAE, offering our valued customers top-quality products from the Richmond and Polar collections. With years of experience, we've earned a solid reputation for being reliable, efficient, and customer satisfaction-centric. Our Jebel Ali warehouse in Dubai holds 60,000 sqm of stock, so we can deliver fast anywhere in the UAE."
  },
  {
    id: 2,
    image: '/assets/images/aboutus/about2.webp',
    alt: 'Second Image',
    heading: 'For Homes And Businesses In The UAE',
    paragraph:
      'We cater to a range of customers, including homeowners, commercial properties like schools and offices, flooring contractors, and interior designers. With a direct factory connection and years of hands-on experience, we’ve designed our flooring materials to handle the tough climate of Dubai and the UAE'
  },
  {
    id: 3,
    image: '/assets/images/aboutus/about3.webp',
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
    title: 'General Guidelines for Measuring Your Room',
    description: `When calculating the width and length of a rectangular or square area, add 5-10% for waste and cutting errors. If you are planning to construct staircases, mantels, or closets in your room, allocate over 10% of your budget to them. 
      If you would like professional assistance, we can arrange a measuring service for you with a refundable charge of <span class='font-currency font-normal text-18 text-black'></span> 150 (refunded if you place an order with us). If you wish to measure the area yourself, you will only need a measuring tape, a pencil, and paper. Make sure you measure in metres if you will be buying flooring materials that are usually marketed in metres.`,
    steps: [],
    image: ''
  },
  {
    title: 'Measuring a Square or Rectangular Room',
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
        title: 'Measure the total area:',
        content: 'To get the floor size in square metres, multiply the length by the width.'
      }
    ],
    image: '/assets/images/how-to-measure-your-room/measure1.webp'
  },
  {
    title: 'Measuring an L-shaped or Irregular Room',
    stepsHeading: 'Measuring an L-shaped or Irregular Room',
    description: 'When dealing with uneven areas, divide the area into smaller, more manageable rectangles and measure each one independently. Then, make a rough sketch and draw the room plan.',
    steps: [
      {
        title: 'Measure Every Section:',
        content: "Take separate measurements of each section's length and width."
      },
      {
        title: 'Determine the total area:',
        content: 'The length of every part should be multiplied by its width before adding them all together to get the total size of the space.'
      }
    ],
    image: '/assets/images/how-to-measure-your-room/measure2.webp'
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

export const Testmonialimages = [
  {
    src: "/assets/white.webp",
    alt: "White Image",
  },
  {
    src: "/assets/showroom.webp",
    alt: "Test Image",
  },
];

export const floorSmartFaqs: FAQItem[] = [
  {
    id: 1,
    question: "What makes FLOOR SMART SPC flooring in Dubai a good choice?",
    answer: "Floor Smart SPC flooring in Dubai is fully waterproof, termite-resistant, and highly durable. It is designed to handle moisture, heavy foot traffic, and daily wear, making it ideal for homes and commercial spaces in Dubai."
  },
  {
    id: 2,
    question: "Is Floor Smart SPC installation complicated?",
    answer: "No, Floor Smart SPC flooring uses a Unilin click-lock system, allowing quick and easy installation without adhesives. It is suitable for both professionals and DIY installation."
  },
  {
    id: 3,
    question: "How does Floor Smart SPC flooring compare to other flooring options?",
    answer: "Floor Smart SPC flooring offers better water resistance, durability, and lower maintenance compared to hardwood and laminate flooring, making it a practical long-term investment."
  },
  {
    id: 4,
    question: "Are SPC flooring prices in Dubai affordable?",
    answer: "Yes, Floor Smart offers competitive SPC flooring prices in Dubai, providing a premium wood-look finish at a much more economical cost than natural wood."
  }
];

export const polarFaqs: FAQItem[] = [
  {
    id: 1,
    question: "Why should I buy Polar flooring for my home?",
    answer: "Buy Polar flooring for its durability, affordability, and stylish designs in Dubai. It is water-resistant and easy to maintain, making it perfect for busy households."
  },
  {
    id: 2,
    question: "What makes Polar SPC flooring Dubai a reliable option?",
    answer: "Polar SPC flooring in Dubai is highly durable, water-resistant, and scratch-resistant, making it ideal for high-traffic areas and long-term use."
  },
  {
    id: 3,
    question: "Is Polar vinyl flooring suitable for commercial spaces in Dubai?",
    answer: "Yes, Polar vinyl flooring Dubai is designed for heavy use, offering durability and easy maintenance, making it perfect for offices, retail, and hospitality spaces."
  },
  {
    id: 4,
    question: "Can I use polar LVT flooring in my bathroom?",
    answer: "Definitely. All polar flooring products are water-resistant and slip-resistant, making them a safe and stylish choice for wet areas like bathrooms and laundry rooms in Dubai."
  }
];

export const richmondFaqs: FAQItem[] = [
  {
    id: 1,
    question: "Where can I buy Richmond flooring in Dubai for my project?",
    answer: "You can buy Richmond flooring in Dubai from trusted suppliers offering a wide range of designs. For premium options and reliable service, consider purchasing from a trusted supplier like easyfloors.ae, known for delivering high-quality flooring solutions."
  },
  {
    id: 2,
    question: "Is Richmond LVT flooring suitable for commercial use?",
    answer: "Yes, Richmond LVT flooring is durable and designed for high-traffic areas like offices, hotels, and retail spaces, ensuring long-lasting performance and style in Dubai. We’re so confident in the quality of our products that we offer a 5-year warranty against manufacturing defects for commercial use and a 10-year warranty for residential use in Dubai."
  },
  {
    id: 3,
    question: "What are the benefits of Richmond SPC flooring in Dubai?",
    answer: "Richmond SPC flooring Dubai offers water-resistant protection, scratch resistance, and strong core stability, making it ideal for both residential and commercial spaces."
  },
  {
    id: 4,
    question: "How easy is Richmond vinyl flooring installation?",
    answer: "Richmond vinyl flooring features a click-lock system, enabling fast, adhesive-free installation in Dubai, saving time and reducing labor costs."
  }
];

export const lvtFaqs: FAQItem[] = [
  {
    id: 1,
    question: "Why is LVT flooring in Dubai popular for modern interiors?",
    answer: "LVT flooring in Dubai is stylish, durable, and water-resistant. It mimics natural materials while being easier to maintain, making it ideal for both residential and commercial spaces."
  },
  {
    id: 2,
    question: "How is LVT flooring installation done — can it go over existing floors?",
    answer: "Yes! LVT flooring installation uses a floating click-lock method that works over most existing surfaces, including tiles and concrete. No adhesive is required, saving time and reducing labour costs significantly across Dubai homes and offices."
  },
  {
    id: 3,
    question: "Is LVT flooring installation suitable for all spaces?",
    answer: "Yes, LVT flooring installation works in homes, offices, and retail areas. Its multiple installation methods make it adaptable to different subfloors and design requirements."
  },
  {
    id: 4,
    question: "Can LVT vinyl flooring be used in commercial shops?",
    answer: "Yes, luxury vinyl flooring is incredibly hard-wearing. It is designed to withstand heavy foot traffic and frequent cleaning, making it a top choice for retail environments in Dubai."
  }
];

export const accessoriesFaqs: FAQItem[] = [
  {
    id: 1,
    question: "Why is accessory flooring in Dubai popular for modern interiors?",
    answer: "LVT flooring in Dubai is stylish, durable, and water-resistant. It mimics natural materials while being easier to maintain, making it ideal for both residential and commercial spaces."
  },
  {
    id: 2,
    question: "How is LVT flooring installation done — can it go over existing floors?",
    answer: "Yes! LVT flooring installation uses a floating click-lock method that works over most existing surfaces, including tiles and concrete. No adhesive is required, saving time and reducing labour costs significantly across Dubai homes and offices."
  },
  {
    id: 3,
    question: "Is LVT flooring installation suitable for all spaces?",
    answer: "Yes, LVT flooring installation works in homes, offices, and retail areas. Its multiple installation methods make it adaptable to different subfloors and design requirements."
  },
  {
    id: 4,
    question: "Can LVT vinyl flooring be used in commercial shops?",
    answer: "Yes, luxury vinyl flooring is incredibly hard-wearing. It is designed to withstand heavy foot traffic and frequent cleaning, making it a top choice for retail environments in Dubai."
  }
];

export const spcFaqs: FAQItem[] = [
  {
    id: 1,
    question: "What makes SPC flooring in Dubai a good choice for homes?",
    answer: "SPC flooring Dubai is water and scratch-resistant, and durable, making it perfect for homes with kids or pets. It handles moisture well and offers long-lasting performance with minimal maintenance needs."
  },
  {
    id: 2,
    question: "Is SPC flooring installation complicated?",
    answer: "No, SPC flooring installation uses a click-lock system, making it simple and fast. Professional installers or even DIY users can easily fit it without adhesives or specialised tools."
  },
  {
    id: 3,
    question: "How does SPC laminate flooring differ from regular laminate or hardwood?",
    answer: "Unlike regular laminate, SPC laminate flooring has a rigid stone polymer core that is water-resistant and more durable. It outperforms hardwood in moisture-prone areas and requires far less maintenance, making it a smart long-term investment."
  },
  {
    id: 4,
    question: "How do SPC flooring prices compare to natural wood?",
    answer: "Our SPC flooring is far more economical than real wood while offering superior durability and moisture resistance, giving you a premium look for a much lower investment."
  }
];

export const categoryFaqsData: Record<string, FAQItem[]> = {
  'floor-smart': floorSmartFaqs,
  'polar-flooring': polarFaqs,
  'richmond-flooring': richmondFaqs,
  'lvt-flooring': lvtFaqs,
  'spc-flooring': spcFaqs,
  'accessories': accessoriesFaqs
};

// ─── Subcategory FAQs ────────────────────────────────────────────────────────

export const polarSpcEcoFaqs: FAQItem[] = [
  {
    id: 1,
    question: 'Is Polar SPC Eco flooring suitable for high-traffic areas?',
    answer:
      'Yes, Polar SPC Eco flooring is built for durability, making it ideal for busy areas like living rooms, offices, and retail spaces. Its ceramic bead finish helps resist scratches, dents, and daily wear.'
  },
  {
    id: 2,
    question: 'Do I need to wax or seal SPC Eco flooring regularly?',
    answer:
      'No, SPC Eco flooring is low-maintenance and does not need waxing or sealing. Regular sweeping and occasional mopping are enough to maintain its clean look and long-lasting surface quality.'
  },
  {
    id: 3,
    question: 'Can Polar SPC Eco flooring handle moisture and spills?',
    answer:
      'Yes, its stone plastic composite core provides excellent moisture resistance. It can easily handle spills and humidity, making it suitable for kitchens, bathrooms, and other damp environments.'
  },
  {
    id: 4,
    question: 'Is the installation process complicated?',
    answer:
      'No, installation is simple and quick thanks to the click-lock system. The planks fit together easily without glue or nails, making it a hassle-free option for both professionals and DIY users.'
  }
];

export const polarSpcHerringboneFaqs: FAQItem[] = [
  {
    id: 1,
    question: 'How durable is Polar SPC Herringbone flooring?',
    answer:
      'With a strong 6.0mm thickness and durable wear layer, it is designed to handle heavy foot traffic. It performs well in homes, offices, and schools while maintaining its structure and appearance.'
  },
  {
    id: 2,
    question: 'Is this flooring resistant to stains and scratches?',
    answer:
      'Yes, it is engineered to resist scratches, stains, and everyday wear. This makes it a reliable option for busy areas where maintaining a clean and polished appearance is important.'
  },
  {
    id: 3,
    question: 'How much maintenance does SPC Herringbone flooring require?',
    answer:
      'It requires very little maintenance. Regular sweeping and occasional damp mopping will keep the surface clean, helping preserve its look and durability over time without extra effort.'
  }
];

export const richmondSpcEcoFaqs: FAQItem[] = [
  {
    id: 1,
    question: 'Does Richmond SPC Eco flooring look like real wood?',
    answer:
      'Yes, it features 3D Natural Embossing and realistic textures that closely replicate natural wood. It offers the aesthetic appeal of timber while delivering the durability of SPC flooring.'
  },
  {
    id: 2,
    question: 'What kind of warranty comes with Richmond SPC Eco flooring?',
    answer:
      'Richmond SPC Eco includes a 10-year residential warranty and a 5-year commercial warranty, providing long-term confidence in its durability, quality, and overall performance.'
  },
  {
    id: 3,
    question: 'Is this flooring protected against fading?',
    answer:
      'Yes, it includes UV protection that helps prevent fading and discoloration. This ensures the flooring maintains its original color and finish even with regular exposure to sunlight.'
  },
  {
    id: 4,
    question: 'Is Richmond SPC Eco easy to install?',
    answer:
      'Yes, it features a click-lock system that allows for quick and easy installation. No glue or nails are required, making it suitable for efficient installation in both residential and commercial spaces.'
  }
];

export const richmondSpcPrimeFaqs: FAQItem[] = [
  {
    id: 1,
    question: 'Is Richmond SPC Prime flooring suitable for commercial spaces?',
    answer:
      'Yes, it is designed for durability and can handle heavy foot traffic. This makes it a great choice for commercial settings like offices, schools, and retail environments.'
  },
  {
    id: 2,
    question: 'How long does Richmond SPC Prime flooring last?',
    answer:
      'With proper care and maintenance, it can last up to 10 years or more. Its durable construction ensures it maintains its appearance even in high-use areas.'
  },
  {
    id: 3,
    question: 'Does this flooring resist water and spills?',
    answer:
      'Yes, it is fully water-resistant and resistant to spills and moisture. This makes it suitable for areas prone to humidity or accidental water exposure.'
  },
  {
    id: 4,
    question: 'Is installation time-consuming?',
    answer:
      'No, installation is quick and efficient due to the click-lock system. The planks fit together easily, reducing labor time and eliminating the need for adhesives.'
  }
];

export const richmondSpcHerringboneFaqs: FAQItem[] = [
  {
    id: 1,
    question:
      'What makes Richmond SPC Herringbone different from standard SPC flooring?',
    answer:
      'It features a stylish herringbone pattern with smaller planks, offering a premium look. This design enhances visual appeal while maintaining the strength and durability of SPC flooring.'
  },
  {
    id: 2,
    question: 'Is this flooring resistant to daily wear and tear?',
    answer:
      'Yes, it is built to resist scratches, stains, and heavy usage. This makes it suitable for both residential and commercial environments with frequent foot traffic.'
  },
  {
    id: 3,
    question: 'Does Richmond SPC Herringbone come with a warranty?',
    answer:
      'Yes, it is backed by a 10-year residential warranty and a 5-year commercial warranty, ensuring long-term reliability and performance.'
  },
  {
    id: 4,
    question: 'Is this flooring a cost-effective option?',
    answer:
      'Yes, it combines durability, style, and low maintenance. Its long lifespan reduces replacement costs, making it a smart and cost-effective flooring investment.'
  }
];

export const polarLvtComfortFaqs: FAQItem[] = [
  {
    id: 1,
    question:
      'Can Polar LVT Comfort flooring be used in kitchens and bathrooms?',
    answer:
      'Yes, it is water-resistant and suitable for moisture-prone areas. It performs well in kitchens and bathrooms without warping or damage from humidity.'
  },
  {
    id: 2,
    question: 'How durable is LVT Comfort flooring for daily use?',
    answer:
      'It is designed to handle scratches, wear, and regular foot traffic. This makes it ideal for busy households that need reliable and long-lasting flooring.'
  },
  {
    id: 3,
    question: 'Is installation easy for Polar LVT Comfort flooring?',
    answer:
      'Yes, the click-lock system allows for quick and easy installation. It does not require professional tools, making it suitable for DIY installation.'
  },
  {
    id: 4,
    question: 'How do I maintain LVT Comfort flooring?',
    answer:
      'Maintenance is simple. Regular sweeping and occasional mopping are enough to keep the floor clean and maintain its fresh appearance over time.'
  }
];

export const richmondLvtComfortFaqs: FAQItem[] = [
  {
    id: 1,
    question:
      'What makes Richmond LVT Comfort suitable for high-traffic areas?',
    answer:
      'Its 0.55mm wear layer provides strong resistance against scratches and wear. This ensures long-lasting performance even in busy residential or commercial spaces.'
  },
  {
    id: 2,
    question: 'Does this flooring enhance the look of a room?',
    answer:
      'Yes, its matte finish and 3D embossing create a modern and spacious feel. It adds visual depth and style to any interior setting.'
  },
  {
    id: 3,
    question: 'Is adhesive required during installation?',
    answer:
      'No, it uses a 4-side click-lock system that allows for glue-free installation. This makes the process faster and cleaner. For heavy foot traffic areas such as retail stores, you can use glue to add additional strength.'
  },
  {
    id: 4,
    question: 'What warranty is included with Richmond LVT Comfort flooring?',
    answer:
      'It includes a 10-year residential warranty and a 5-year commercial warranty, offering assurance of durability and long-term quality.'
  }
];

export const richmondLvtLuxuryFaqs: FAQItem[] = [
  {
    id: 1,
    question: 'Does Richmond LVT Luxury flooring look like real hardwood?',
    answer:
      'Yes, it features wider planks and natural textures that replicate hardwood flooring. It delivers an elegant look without the maintenance challenges of real wood.'
  },
  {
    id: 2,
    question: 'Can this flooring handle humidity and spills?',
    answer:
      'Yes, it is designed to resist moisture, spills, and humidity. This makes it suitable for both residential and commercial environments.'
  },
  {
    id: 3,
    question: 'What happens if a plank gets damaged?',
    answer:
      'Individual planks can be easily replaced due to the click-lock system. Usually, there is no need to remove the entire floor, saving time and effort.'
  },
  {
    id: 4,
    question: 'Is Richmond LVT Luxury an eco-friendly option?',
    answer:
      'Yes, it is manufactured using environmentally responsible materials. It offers durability and performance while supporting sustainable flooring solutions.'
  }
];

export const floorSmartSpcEcoFaqs: FAQItem[] = [
  {
    id: 1,
    question: "What makes FLOOR SMART SPC flooring in Dubai a good choice?",
    answer: "Floor Smart SPC flooring in Dubai is fully waterproof, termite-resistant, and highly durable. It is designed to handle moisture, heavy foot traffic, and daily wear, making it ideal for homes and commercial spaces in Dubai."
  },
  {
    id: 2,
    question: "Is Floor Smart SPC installation complicated?",
    answer: "No, Floor Smart SPC flooring uses a Unilin click-lock system, allowing quick and easy installation without adhesives. It is suitable for both professionals and DIY installation."
  },
  {
    id: 3,
    question: "How does Floor Smart SPC flooring compare to other flooring options?",
    answer: "Floor Smart SPC flooring offers better water resistance, durability, and lower maintenance compared to hardwood and laminate flooring, making it a practical long-term investment."
  },
  {
    id: 4,
    question: "Are SPC flooring prices in Dubai affordable?",
    answer: "Yes, Floor Smart offers competitive SPC flooring prices in Dubai, providing a premium wood-look finish at a much more economical cost than natural wood."
  }
];

export const subCategoryFaqsData: Record<string, FAQItem[]> = {
  'polar-spc-eco': polarSpcEcoFaqs,
  'polar-spc-herringbone': polarSpcHerringboneFaqs,
  'richmond-spc-eco': richmondSpcEcoFaqs,
  'richmond-spc-prime': richmondSpcPrimeFaqs,
  'richmond-spc-herringbone': richmondSpcHerringboneFaqs,
  'polar-lvt-comfort': polarLvtComfortFaqs,
  'richmond-lvt-comfort': richmondLvtComfortFaqs,
  'floor-smart-spc-eco': floorSmartSpcEcoFaqs,
  'richmond-lvt-luxury': richmondLvtLuxuryFaqs,
};
