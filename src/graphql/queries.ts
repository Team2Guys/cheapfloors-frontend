import { gql } from '@apollo/client';

export const FETCH_ALL_PRODUCTS = gql`
  query Products {
    products {
      id
      name
      price
      discountPrice
      description
      stock
      status
      posterImageUrl
      hoverImageUrl
      productImages
      createdAt
      updatedAt
      Canonical_Tag
      Meta_Description
      Meta_Title
      last_editedBy
      custom_url
      waterproof
      AdditionalInformation
      plankWidth
      ResidentialWarranty
      CommmericallWarranty
      colorCode
      colors
      thickness
      sizes
      FAQS
      sku
      stockUpdateDate
      boxCoverage
      featureImages

      category {
        id
        name
        RecallUrl
        custom_url
        status
      }
      subcategory {
        id
        name
        custom_url
        status
      }
      acessories {
        id
        name
        price
        discountPrice
        custom_url
        stock
        posterImageUrl
        hoverImageUrl
        sizes
        featureImages
        productImages
        status
      }
    }
  }
`;

export const FETCH_HEADER_PRODUCTS = gql`
  query Products {
    products {
      id
      name
      price
      discountPrice
      description
      stock
      status
      posterImageUrl
      custom_url
      category {
        id
        name
        RecallUrl
        custom_url
        status
      }
      subcategory {
        id
        name
        custom_url
        status
      }
      acessories {
        id
        name
        price
        stock
        discountPrice
        custom_url
        posterImageUrl
        hoverImageUrl
        productImages
        status
      }
    }
  }
`;

export const FETCH_ALL_CATEGORIES = gql`
  query Categories {
    categories {
      id
      name
      description
      posterImageUrl
      createdAt
      updatedAt
      Canonical_Tag
      Meta_Description
      Meta_Title
      last_editedBy
      custom_url
      Recall_Cat
      whatAmiImageBanner
      topHeading
      RecallUrl
      status
      price
      recalledSubCats {
        id
        name
        status
        custom_url
        sizes
        category {
          RecallUrl
        }
      }
      subcategories {
        id
        name
        posterImageUrl
        custom_url
        description
        sizes
        BannerImage
        price
        status
      }
      products {
        id
        name
        price
        discountPrice
        description
        stock
        posterImageUrl
        hoverImageUrl
        productImages
        custom_url
        waterproof
        plankWidth
        colorCode
        colors
        ResidentialWarranty
        CommmericallWarranty
        thickness
        boxCoverage
        sizes
        status
        subcategory {
          id
          name
          custom_url
          status
        }
        acessories {
          id
          name
          price
          discountPrice
          custom_url
          posterImageUrl
        }
        category {
          RecallUrl
          status
        }
      }
    }
  }
`;
export const FETCH_ALL_SUB_CATEGORIES = gql`
  query SubCategories {
    subCategories {
      id
      name
      description
      posterImageUrl
      createdAt
      updatedAt
      Canonical_Tag
      Meta_Description
      Meta_Title
      last_editedBy
      custom_url
      Recall_subCat
      short_description
      whatAmiImage
      whatamIdetails
      whatAmiTopHeading
      whatAmiImageBanner
      homePageImage
      Heading
      BannerImage
      price
      sizes
      status
      whatIamEndpoint
      whatAmiMeta_Title
      whatAmiCanonical_Tag
      whatAmiMeta_Description
      products {
        id
        name
      }
      category {
        id
        name
      }
      recalledByCategories {
        id
        name
        RecallUrl
      }
    }
  }
`;

export const FETCH_ALL_WHAT_AM_I = gql`
  query SubCategories {
    subCategories {
      id
      name
      whatAmiImage
      whatamIdetails
      whatAmiTopHeading
      whatAmiImageBanner
      homePageImage
      whatIamEndpoint
      status
    }
  }
`;

export const FETCH_ALL_WHAT_AM_I_META_TAGS = gql`
  query SubCategories {
    subCategories {
      whatIamEndpoint
      id
      name

      whatAmiMeta_Title
      whatAmiCanonical_Tag
      whatAmiMeta_Description
      posterImageUrl
      custom_url
    }
  }
`;

export const FETCH_ALL_APPOINTMENTS = gql`
  query appointments {
    appointments {
      firstname
      email
      phoneNumber
      whatsappNumber
      area
      selectRooms
      preferredTime
      findUs
      comment
      contactMethod
      preferredDate
      AppointsType
    }
  }
`;

export const FETCH_ALL_ORDERS = gql`
  query AllOrders {
    AllOrders {
      firstName
      lastName
      email
      country
      city
      address
      note
      phone
      emirate
      orderId
      transactionDate
      shipmentFee
      totalPrice
      checkout
      paymentStatus
      isRefund
      success
      pending
      currency
      is3DSecure
      checkoutDate
      shippingMethod
      pay_methodType
      paymethod_sub_type
      cardLastDigits
      orderStatus
      deliveryDate
      isfreesample
      products {
        id
        name
        price
        stock
        image
        subcategories
        category
        boxCoverage
        totalPrice
        pricePerBox
        squareMeter
        requiredBoxes
        custom_url
        isClearance
        installationCost
        addInstallation
        selectedColor {
          color
          altText
          imageUrl
          colorName
          public_id
        }
      }
    }
  }
`;

export const GET_ORDER_HISTORY = gql`
  query UsersOrders($email: String!) {
    usersOrders(email: $email) {
      firstName
      lastName
      email
      country
      city
      address
      note
      phone
      emirate
      orderId
      transactionDate
      shipmentFee
      totalPrice
      pay_methodType
      paymethod_sub_type
      cardLastDigits
      checkout
      paymentStatus
      isRefund
      success
      pending
      currency
      is3DSecure
      checkoutDate
      shippingMethod
      products {
        id
        name
        price
        stock
        image
        subcategories
        category
        boxCoverage
        totalPrice
        pricePerBox
        squareMeter
        requiredBoxes
      }
    }
  }
`;

export const GET_ALL_ADMINS = gql`
  query Admins {
    admins {
      id
      fullname
      email
      password
      status
      canAddProduct
      canEditProduct
      canDeleteProduct
      canAddCategory
      canDeleteCategory
      canEditCategory
      canCheckProfit
      canCheckRevenue
      canCheckVisitors
      canViewUsers
      canViewSales
      canVeiwAdmins
      canVeiwTotalproducts
      canVeiwTotalCategories
      posterImageUrl
      role
    }
  }
`;
export const FETCH_HEADER_CATEGORIES = gql`
  query Categories {
    categories {
      id
      name
      custom_url
      status
      RecallUrl
      price
      accessories {
        id
        name
        custom_url
        posterImageUrl
        status
      }
      subcategories {
        id
        name
        custom_url
        posterImageUrl
        price
        sizes
        status
      }
      products {
        id
        name
        price
        discountPrice
        stock
        posterImageUrl
      }
      recalledSubCats {
        id
        name
        custom_url
        posterImageUrl
        sizes
        price
        status
        category {
          RecallUrl
        }
      }
    }
  }
`;
export const FETCHSUBCAT = gql`
  query SubCategories {
    subCategories {
      id
      name
      posterImageUrl
      custom_url
      price
      sizes
      status
      products {
        id
        name
      }
      category {
        id
        name
        custom_url
        RecallUrl
      }
    }
  }
`;

export const FIND_ONE_CATEGORY = gql`
  query GetCategory($customUrl: String!) {
    category(customUrl: $customUrl) {
      id
      name
      Canonical_Tag
      Meta_Description
      Meta_Title
      posterImageUrl
      custom_url
    }
  }
`;

export const FIND_ONE_Accessory = gql`
  query GetCategory($customUrl: String!, $accessoryFlag: Boolean) {
    category(customUrl: $customUrl, accessoryFlag: $accessoryFlag) {
      id
      name
      description
      Meta_Title
      Canonical_Tag
      whatAmiImageBanner
      status
      accessories {
        id
        name
        price
        discountPrice
        stock
        posterImageUrl
        featureImages
        custom_url
        sizes
        status
      }
    }
  }
`;

export const FIND_ONE_SUB_CATEGORY = gql`
  query SubCategory($customUrl: String!, $category: String!) {
    subCategory(customUrl: $customUrl, category: $category) {
      id
      name
      Canonical_Tag
      Meta_Description
      Meta_Title
      posterImageUrl
      custom_url
      category {
        custom_url
      }
    }
  }
`;

export const FIND_ONE_PRODUCT = gql`
  query Product(
    $custom_url: String!
    $category: String!
    $subCategory: String!
    $acessories: Boolean
  ) {
    product(
      custom_url: $custom_url
      category: $category
      subCategory: $subCategory
      acessories: $acessories
    ) {
      id
      name
      price
      discountPrice
      status
      stock
      productImages
      boxCoverage
      featureImages
      posterImageUrl
      Meta_Title
      Meta_Description
      Canonical_Tag
      AdditionalInformation
      colors
      thickness
      sizes
      FAQS
      custom_url
      description
      acessories {
        id
        name
        price
        discountPrice
        custom_url
        stock
        posterImageUrl
        hoverImageUrl
        sizes
        featureImages
        productImages
        status
      }
      category {
        RecallUrl
      }
      subcategory {
        custom_url
        status
        name
      }
    }
  }
`;

export const FIND_QUICK_VIEW_PRODUCT = gql`
  query Product(
    $custom_url: String!
    $category: String!
    $subCategory: String!
    $acessories: Boolean!
  ) {
    product(
      custom_url: $custom_url
      category: $category
      subCategory: $subCategory
      acessories: $acessories
    ) {
      id
      name
      price
      discountPrice
      description
      stock
      posterImageUrl
      hoverImageUrl
      productImages
      custom_url
      waterproof
      AdditionalInformation
      plankWidth
      ResidentialWarranty
      CommmericallWarranty
      colorCode
      thickness
      FAQS
      boxCoverage
      featureImages
      sizes
      category {
        id
        name
        RecallUrl
        custom_url
      }
      subcategory {
        id
        name
        custom_url
      }
      acessories {
        id
        name
        price
        discountPrice
        custom_url
        posterImageUrl
        featureImages
        status
      }
    }
  }
`;

export const GET_ALL_RECORDS = gql`
  query GET_ALL_RECORDS {
    GET_ALL_RECORDS {
      totalSubCategories
      totalProducts
      totalCategories
      totalAdmins
      totalRevenue
      totalSoldProducts
      totalUsers
      totalabundantOrderProd
      totalAccessories
      Orders
      abdundantOrders
      freeSamples
      InstallationAppointments
      MeasureAppointments
    }
  }
`;

export const FIND_ONE_USER = gql`
  query FindOne($email: String!) {
    find_one(email: $email) {
      id
      name
      email
      token
      userImageUrl
    }
  }
`;
