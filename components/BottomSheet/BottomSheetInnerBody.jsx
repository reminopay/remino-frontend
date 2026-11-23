import Divider from "../common/Divider";

const BottomSheetInnerBody = ({ items }) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-10 border border-primary-50 px-4 py-6">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between text-sm font-normal">
            <div className="text-primary-500">{item.title}</div>
            <div className="text-end text-neutrall-900">{item.desc}</div>
          </div>
          {index !== items.length - 1 && <Divider dash={false} />}
        </div>
      ))}
    </div>
  );
};

export default BottomSheetInnerBody;
