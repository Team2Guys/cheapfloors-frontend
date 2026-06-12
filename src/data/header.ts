import { Category } from "@/types/cat";
import { IProduct } from "@/types/prod";

export const staticAccessories = [
    {
        id: 'acc-1',
        name: 'Reducer',
        custom_url: 'reducer',
        status: 'PUBLISHED',
        posterImageUrl: {
            imageUrl: '/assets/images/headerpics/reducer.webp',
            altText: 'Reducer',
            public_id: ''
        }
    },
    {
        id: 'acc-2',
        name: 'T Profile',
        custom_url: 't-profile',
        status: 'PUBLISHED',
        posterImageUrl: {
            imageUrl: '/assets/images/headerpics/TProfile.webp',
            altText: 'T Profile',
            public_id: ''
        }
    },
    {
        id: 'acc-3',
        name: 'Stair Nose',
        custom_url: 'stair-nose',
        status: 'PUBLISHED',
        posterImageUrl: {
            imageUrl: '/assets/images/headerpics/stairnose.webp',
            altText: 'Stair Nose',
            public_id: ''
        }
    },
    {
        id: 'acc-4',
        name: 'Quarter Round',
        custom_url: 'quarter-round',
        status: 'PUBLISHED',
        posterImageUrl: {
            imageUrl: '/assets/images/headerpics/qurtorround.webp',
            altText: 'Quarter Round',
            public_id: ''
        }
    },
    {
        id: 'acc-5',
        name: 'Skirting 10cm Height',
        custom_url: 'l-shape-skirting-10cm-height',
        status: 'PUBLISHED',
        posterImageUrl: {
            imageUrl: '/assets/images/headerpics/L10.webp',
            altText: 'L Shape Skirting 10cm Height',
            public_id: ''
        }
    },
    {
        id: 'acc-6',
        name: 'L Shape Skirting 12cm Height',
        custom_url: 'l-shape-skirting-12cm-height',
        status: 'PUBLISHED',
        posterImageUrl: {
            imageUrl: '/assets/images/headerpics/L12.webp',
            altText: 'L Shape Skirting 12cm Height',
            public_id: ''
        }
    },
    {
        id: 'acc-7',
        name: 'L Shape Skirting 15cm Height',
        custom_url: 'l-shape-skirting-15cm-height',
        status: 'PUBLISHED',
        posterImageUrl: {
            imageUrl: '/assets/images/headerpics/L15.webp',
            altText: 'L Shape Skirting 15cm Height',
            public_id: ''
        }
    },
    {
        id: 'acc-8',
        name: 'Skirting 8cm Height',
        custom_url: 'skirting-8cm-height',
        status: 'PUBLISHED',
        posterImageUrl: {
            imageUrl: '/assets/images/headerpics/L8.webp',
            altText: 'Skirting 8cm Height',
            public_id: ''
        }
    },
    {
        id: 'acc-9',
        name: 'Skirting 12cm Height',
        custom_url: 'skirting-12cm-height',
        status: 'PUBLISHED',
        posterImageUrl: {
            imageUrl: '/assets/images/headerpics/skirting12.webp',
            altText: 'Skirting 12cm Height',
            public_id: ''
        }
    }
];

export const staticCategories = [
    {
        id: 'spc-flooring',
        name: 'SPC Flooring',
        custom_url: 'spc-flooring',
        RecallUrl: 'spc-flooring',
        createdAt: new Date(),
        updatedAt: new Date(),
        recalledSubCats: [],
        subcategories: [
            {
                id: 'polar-spc-eco',
                name: 'Polar SPC Eco',
                custom_url: 'spc-eco',
                category: { RecallUrl: 'polar' },
                status: 'PUBLISHED',
                price: '55.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/polarspceco.webp', altText: 'Polar SPC Eco', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'polar-spc-herringbone',
                name: 'Polar SPC Herringbone',
                custom_url: 'spc-herringbone',
                category: { RecallUrl: 'polar' },
                status: 'PUBLISHED',
                price: '110.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/polarspcharingbone.webp', altText: 'Polar SPC Herringbone', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'richmond-spc-eco',
                name: 'Richmond SPC Eco',
                custom_url: 'spc-eco',
                category: { RecallUrl: 'richmond' },
                status: 'PUBLISHED',
                price: '87.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspceco.webp', altText: 'Richmond SPC Eco', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'richmond-spc-prime',
                name: 'Richmond SPC Prime',
                custom_url: 'spc-prime',
                category: { RecallUrl: 'richmond' },
                status: 'PUBLISHED',
                price: '105.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspcprime.webp', altText: 'Richmond SPC Prime', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'richmond-spc-herringbone',
                name: 'Richmond SPC Herringbone',
                custom_url: 'spc-herringbone',
                category: { RecallUrl: 'richmond' },
                status: 'PUBLISHED',
                price: '130.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspcharingbone.webp', altText: 'Richmond SPC Herringbone', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'floor-smart-spc-eco',
                name: 'Floor Smart SPC Eco',
                custom_url: 'spc-eco',
                category: { RecallUrl: 'floor-smart' },
                status: 'PUBLISHED',
                price: '90.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/floorsmartspceco.webp', altText: 'Floor Smart SPC Eco', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ],
        posterImageUrl: { imageUrl: '/assets/images/headerpics/polarspceco.webp', public_id: '' }
    },
    {
        id: 'lvt-flooring',
        name: 'LVT Flooring',
        custom_url: 'lvt-flooring',
        RecallUrl: 'lvt-flooring',
        createdAt: new Date(),
        updatedAt: new Date(),
        recalledSubCats: [],
        subcategories: [
            {
                id: 'polar-lvt-comfort',
                name: 'Polar LVT Comfort',
                custom_url: 'lvt-comfort',
                category: { RecallUrl: 'polar' },
                status: 'PUBLISHED',
                price: '65.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/polarlvtcomfort.webp', altText: 'Polar LVT Comfort', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'richmond-lvt-comfort',
                name: 'Richmond LVT Comfort',
                custom_url: 'lvt-comfort',
                category: { RecallUrl: 'richmond' },
                status: 'PUBLISHED',
                price: '60.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondlvtcomfort.webp', altText: 'Richmond LVT Comfort', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'richmond-lvt-luxury',
                name: 'Richmond LVT Luxury',
                custom_url: 'lvt-luxury',
                category: { RecallUrl: 'richmond' },
                status: 'PUBLISHED',
                price: '75.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondlvtluxury.webp', altText: 'Richmond LVT Luxury', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ],
        posterImageUrl: { imageUrl: '/assets/images/headerpics/polarlvtcomfort.webp', public_id: '' }
    },
    {
        id: 'richmond-flooring',
        name: 'Richmond Flooring',
        custom_url: 'richmond-flooring',
        RecallUrl: 'richmond-flooring',
        createdAt: new Date(),
        updatedAt: new Date(),
        recalledSubCats: [],
        subcategories: [
            {
                id: 'richmond-spc-eco',
                name: 'Richmond SPC Eco',
                custom_url: 'spc-eco',
                category: { RecallUrl: 'richmond' },
                status: 'PUBLISHED',
                price: '87.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspceco.webp', altText: 'Richmond SPC Eco', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'richmond-spc-prime',
                name: 'Richmond SPC Prime',
                custom_url: 'spc-prime',
                category: { RecallUrl: 'richmond' },
                status: 'PUBLISHED',
                price: '105.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspcprime.webp', altText: 'Richmond SPC Prime', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'richmond-spc-herringbone',
                name: 'Richmond SPC Herringbone',
                custom_url: 'spc-herringbone',
                category: { RecallUrl: 'richmond' },
                status: 'PUBLISHED',
                price: '130.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspcharingbone.webp', altText: 'Richmond SPC Herringbone', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'richmond-lvt-comfort',
                name: 'Richmond LVT Comfort',
                custom_url: 'lvt-comfort',
                category: { RecallUrl: 'richmond' },
                status: 'PUBLISHED',
                price: '60.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondlvtcomfort.webp', altText: 'Richmond LVT Comfort', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'richmond-lvt-luxury',
                name: 'Richmond LVT Luxury',
                custom_url: 'lvt-luxury',
                category: { RecallUrl: 'richmond' },
                status: 'PUBLISHED',
                price: '75.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondlvtluxury.webp', altText: 'Richmond LVT Luxury', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ],
        posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspceco.webp', public_id: '' }
    },
    {
        id: 'polar-flooring',
        name: 'Polar Flooring',
        custom_url: 'polar-flooring',
        RecallUrl: 'polar-flooring',
        createdAt: new Date(),
        updatedAt: new Date(),
        recalledSubCats: [],
        subcategories: [
            {
                id: 'polar-spc-eco',
                name: 'Polar SPC Eco',
                custom_url: 'spc-eco',
                category: { RecallUrl: 'polar' },
                status: 'PUBLISHED',
                price: '55.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/polarspceco.webp', altText: 'Polar SPC Eco', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'polar-spc-herringbone',
                name: 'Polar SPC Herringbone',
                custom_url: 'spc-herringbone',
                category: { RecallUrl: 'polar' },
                status: 'PUBLISHED',
                price: '110.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/polarspcharingbone.webp', altText: 'Polar SPC Herringbone', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'polar-lvt-comfort',
                name: 'Polar LVT Comfort',
                custom_url: 'lvt-comfort',
                category: { RecallUrl: 'polar' },
                status: 'PUBLISHED',
                price: '65.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/polarlvtcomfort.webp', altText: 'Polar LVT Comfort', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ],
        posterImageUrl: { imageUrl: '/assets/images/headerpics/polarspceco.webp', public_id: '' }
    },
    {
        id: 'floor-smart',
        name: 'Floor Smart',
        custom_url: 'floor-smart',
        RecallUrl: 'floor-smart',
        createdAt: new Date(),
        updatedAt: new Date(),
        recalledSubCats: [],
        subcategories: [
            {
                id: 'floor-smart-spc-eco',
                name: 'Floor Smart SPC Eco',
                custom_url: 'spc-eco',
                category: { RecallUrl: 'floor-smart' },
                status: 'PUBLISHED',
                price: '90.00',
                posterImageUrl: { imageUrl: '/assets/images/headerpics/floorsmartspceco.webp', altText: 'Floor Smart SPC Eco', public_id: '' },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ],
        posterImageUrl: { imageUrl: '/assets/images/headerpics/floorsmartspceco.webp', public_id: '' }
    },
    {
        id: 'accessories',
        name: 'accessories',
        custom_url: 'accessories',
        RecallUrl: 'accessories',
        createdAt: new Date(),
        updatedAt: new Date(),
        recalledSubCats: [],
        subcategories: [],
        accessories: staticAccessories as any,
        posterImageUrl: { imageUrl: '/assets/images/headerpics/reducer.webp', public_id: '' }
    }
] as unknown as Category[];

export const staticProducts = [
    {
        id: 'prod-1',
        name: 'Richmond SPC Eco - Cherry',
        price: 87,
        discountPrice: 25,
        stock: 100,
        description: 'High-quality SPC Eco Cherry flooring with UV top coating and rigid support core.',
        custom_url: 'richmond-spc-eco-cherry',
        status: 'PUBLISHED',
        posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspceco.webp', public_id: '' },
        category: { RecallUrl: 'richmond', status: 'PUBLISHED' },
        subcategory: { custom_url: 'spc-eco', status: 'PUBLISHED' },
        acessories: []
    },
    {
        id: 'prod-2',
        name: 'Richmond SPC Eco - Forest',
        price: 87,
        discountPrice: 25,
        stock: 100,
        description: 'Durable SPC Eco Forest flooring, scratch and water resistant.',
        custom_url: 'richmond-spc-eco-forest',
        status: 'PUBLISHED',
        posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspceco.webp', public_id: '' },
        category: { RecallUrl: 'richmond', status: 'PUBLISHED' },
        subcategory: { custom_url: 'spc-eco', status: 'PUBLISHED' },
        acessories: []
    },
    {
        id: 'prod-3',
        name: 'Richmond SPC Eco - Mid Grey',
        price: 87,
        discountPrice: 30,
        stock: 100,
        description: 'Elegant SPC Eco Mid Grey flooring suitable for modern home interiors.',
        custom_url: 'richmond-spc-eco-mid-grey',
        status: 'PUBLISHED',
        posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspceco.webp', public_id: '' },
        category: { RecallUrl: 'richmond', status: 'PUBLISHED' },
        subcategory: { custom_url: 'spc-eco', status: 'PUBLISHED' },
        acessories: []
    },
    {
        id: 'prod-4',
        name: 'Richmond SPC Prime - Steel Grey',
        price: 105,
        discountPrice: 25,
        stock: 100,
        description: 'Premium SPC Prime Steel Grey flooring with integrated IXPE underlay.',
        custom_url: 'richmond-spc-prime-steel-grey',
        status: 'PUBLISHED',
        posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspcpime.webp', public_id: '' },
        category: { RecallUrl: 'richmond', status: 'PUBLISHED' },
        subcategory: { custom_url: 'spc-prime', status: 'PUBLISHED' },
        acessories: []
    },
    {
        id: 'prod-5',
        name: 'Richmond SPC Stone - Light Grey',
        price: 109,
        discountPrice: 30,
        stock: 100,
        description: 'Realistic SPC Stone Light Grey flooring replicates natural stone aesthetics.',
        custom_url: 'richmond-spc-stone-light-grey',
        status: 'PUBLISHED',
        posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondspcpime.webp', public_id: '' },
        category: { RecallUrl: 'richmond', status: 'PUBLISHED' },
        subcategory: { custom_url: 'spc-prime', status: 'PUBLISHED' },
        acessories: []
    },
    {
        id: 'prod-6',
        name: 'Richmond LVT Luxury - Silver',
        price: 149,
        discountPrice: 30,
        stock: 100,
        description: 'Affordable luxury LVT Luxury Silver flooring, water-resistant and durable.',
        custom_url: 'richmond-lvt-luxury-silver',
        status: 'PUBLISHED',
        posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondlvtluxury.webp', public_id: '' },
        category: { RecallUrl: 'richmond', status: 'PUBLISHED' },
        subcategory: { custom_url: 'lvt-luxury', status: 'PUBLISHED' },
        acessories: []
    },
    {
        id: 'prod-7',
        name: 'Richmond LVT Luxury - American Walnut',
        price: 149,
        discountPrice: 30,
        stock: 100,
        description: 'Beautiful LVT Luxury American Walnut wood-effect planks for contemporary spaces.',
        custom_url: 'richmond-lvt-luxury-american-walnut',
        status: 'PUBLISHED',
        posterImageUrl: { imageUrl: '/assets/images/headerpics/richmondlvtluxury.webp', public_id: '' },
        category: { RecallUrl: 'richmond', status: 'PUBLISHED' },
        subcategory: { custom_url: 'lvt-luxury', status: 'PUBLISHED' },
        acessories: []
    },
    {
        id: 'prod-8',
        name: 'Polar SPC Eco - Oak',
        price: 55,
        discountPrice: null,
        stock: 100,
        description: 'Polar SPC Eco Oak flooring offers a warm wood look at factory direct prices.',
        custom_url: 'polar-spc-eco-oak',
        status: 'PUBLISHED',
        posterImageUrl: { imageUrl: '/assets/images/headerpics/polarspceco.webp', public_id: '' },
        category: { RecallUrl: 'polar', status: 'PUBLISHED' },
        subcategory: { custom_url: 'spc-eco', status: 'PUBLISHED' },
        acessories: []
    },
    {
        id: 'prod-9',
        name: 'Polar SPC Herringbone - Honey',
        price: 110,
        discountPrice: null,
        stock: 100,
        description: 'Elegant Polar SPC Herringbone Honey pattern flooring with IXPE underlay.',
        custom_url: 'polar-spc-herringbone-honey',
        status: 'PUBLISHED',
        posterImageUrl: { imageUrl: '/assets/images/headerpics/polarspcheringbone.webp', public_id: '' },
        category: { RecallUrl: 'polar', status: 'PUBLISHED' },
        subcategory: { custom_url: 'spc-herringbone', status: 'PUBLISHED' },
        acessories: []
    },
    {
        id: 'prod-10',
        name: 'Floor Smart SPC Eco - Classic',
        price: 90,
        discountPrice: null,
        stock: 100,
        description: 'Floor Smart SPC Eco Classic flooring, 100% waterproof and antifungal.',
        custom_url: 'floor-smart-spc-eco-classic',
        status: 'PUBLISHED',
        posterImageUrl: { imageUrl: '/assets/images/headerpics/floorsmartspceco.webp', public_id: '' },
        category: { RecallUrl: 'floor-smart', status: 'PUBLISHED' },
        subcategory: { custom_url: 'spc-eco', status: 'PUBLISHED' },
        acessories: []
    }
] as unknown as IProduct[];