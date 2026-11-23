import { useTranslations } from "next-intl";
import TabItem from "@/app/[locale]/transactions/_components/TabItem";

const Tabs = ({ currentTab, setCurrentTab, tabContent }) => {
  const t = useTranslations("Transactions");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-center justify-start gap-2">
        <TabItem
          title={t("tab1")}
          active={currentTab === 1}
          onClick={() => setCurrentTab(1)}
        />
        <TabItem
          title={t("tab2")}
          active={currentTab === 2}
          onClick={() => setCurrentTab(2)}
        />
        <TabItem
          title={t("tab3")}
          active={currentTab === 3}
          onClick={() => setCurrentTab(3)}
        />
        <TabItem
          title={t("tab4")}
          active={currentTab === 4}
          onClick={() => setCurrentTab(4)}
        />
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        {tabContent}
      </div>
    </div>
  );
};

export default Tabs;
