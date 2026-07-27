import { BannerFlooring } from '@/components/flooring/BannerFlooring'
import { FlooringFeatures } from '@/components/flooring/FlooringFeatures'
import { FlooringQuoteForm } from '@/components/flooring/FlooringQuoteForm'
import { FlooringWorkflow } from '@/components/flooring/FlooringWorkflow'
import { FlooringBrands } from '@/components/flooring/FlooringBrands'
import { FlooringTrust } from '@/components/flooring/FlooringTrust'
import React from 'react'
import Faqs from '@/components/Faqs/Faqs'
import { FlooringFaqs } from '@/data/flooring'
import { createMetadata } from 'utils/metadataHelper'
import { pageMetadataData } from 'data/meta-data'

export const metadata = createMetadata(pageMetadataData.flooringSupplierUAE)

const FlooringSupplierUAE = () => {
    return (
        <>
            <BannerFlooring />
            <FlooringFeatures />
            <FlooringQuoteForm />
            <FlooringWorkflow />
            <FlooringBrands />
            <FlooringTrust />
            <Faqs data={FlooringFaqs} />
        </>
    )
}

export default FlooringSupplierUAE