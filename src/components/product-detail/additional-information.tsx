import Tabs from 'components/ui/tabs';
import { AdditionalInfoProps } from 'types/product-detail';

const AdditionalInfo = ({
  description,
  AdditionalInformation,
  subcategory,
  name
}: AdditionalInfoProps) => {
  const tabItems = [
    {
      label: 'Description',
      value: 'description',
      content: (
        <div>
          <h2 className="text-lg sm:text-2xl font-bold mb-4">{name}</h2>

          <p
            className="text-sm sm:text-base leading-relaxed prose prose-sm max-w-none [&_p]:mb-3 [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )
    },
    {
      label: 'Additional Information',
      value: 'additional-info',
      content: (
        <table className="w-full sm:max-w-[80%] text-left border-collapse rounded-md text-sm">
          <tbody className="rounded-md">
            <tr className="bg-primary text-white rounded-t-md">
              <th className="py-2 px-4 rounded-tl-md">ITEM</th>
              <th className="py-2 px-4 rounded-tr-md">{subcategory || ''}</th>
            </tr>
            {AdditionalInformation &&
              AdditionalInformation.map((spec, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{spec.name}</td>
                  <td className="py-2 px-4 border">{spec.detail}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )
    }
  ];
  return <Tabs tabs={tabItems} variant="product-detail" />;
};

export default AdditionalInfo;
