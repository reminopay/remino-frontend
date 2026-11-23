import Divider from "@/components/common/Divider";

const ExchangeAndTransferReport = ({ keys, item1, item2 }) => {
  return (
    <div className="flex flex-col justify-center rounded-10 border border-primary-50 px-4">
      <div className="flex items-center justify-between pb-4 pt-6 text-sm font-normal">
        <span className="text-primary-500">{keys[0]}</span>
        <span className="text-neutrall-900">{item1}</span>
      </div>
      <Divider dash={false} />
      <div className="flex items-center justify-between py-4 text-sm font-normal">
        <div className="flex items-center justify-start gap-2">
          <span className="text-primary-500">{keys[1]}</span>
        </div>
        <span className="text-neutrall-900">{item2}</span>
      </div>
    </div>
  );
};

export default ExchangeAndTransferReport;
