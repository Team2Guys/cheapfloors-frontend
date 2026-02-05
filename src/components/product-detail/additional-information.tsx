import Tabs from 'components/ui/tabs';
import { AdditionalInfoProps } from 'types/product-detail';

const AdditionalInfo = ({
  description,
  AdditionalInformation,
  subcategory
}: AdditionalInfoProps) => {
  const tabItems = [
    {
      label: 'Description',
      value: 'description',
      content: (
        <p className="text-xs sm:text-sm 2xl:text-base text-justify" dangerouslySetInnerHTML={{ __html: description }}></p>
      )
    },
    {
      label: 'Dimensions',
      value: 'dimensions',
      content: (
        <table className="w-full sm:max-w-[80%] mx-auto text-left border-collapse  rounded-md text-sm">
          <tbody className="rounded-md">
            <tr className="bg-primary text-white rounded-t-md">
              <th className="py-2 px-4 rounded-tl-md ">ITEM</th>
              <th className="py-2 px-4 rounded-tr-md">{subcategory || ''}</th>
            </tr>
            {AdditionalInformation &&
              AdditionalInformation.map((spec, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border ">{spec.name}</td>
                  <td className="py-2 px-4 border">{spec.detail}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )
    }
  ];
  return <Tabs tabs={tabItems} />;
};

export default AdditionalInfo;
