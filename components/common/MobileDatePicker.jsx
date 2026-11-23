import React, { useEffect, useState, useRef } from "react";
import * as moment from "jalali-moment";

const MobileDatePicker = ({
  type,
  calendarType = "jalali",
  date,
  setDate,
  expirationMode = false,
}) => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [days, setDays] = useState([]);
  const today = new Date();
  const yearsRef = useRef(null);
  const daysRef = useRef(null);
  const monthsRef = useRef(null);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    if (domLoaded) {
      if (calendarType === "jalali") {
        scrollToSelected("years", date.jYear().toString());
        scrollToSelected(
          "months",
          date.jMonth() + 1 < 10
            ? `0${date.jMonth() + 1}`
            : `${date.jMonth() + 1}`,
        );
        setDays(generateDays(date.year(), date.jMonth() + 1));
      } else {
        scrollToSelected("years", date.year().toString());
        scrollToSelected(
          "months",
          date.month() + 1 < 10
            ? `0${date.month() + 1}`
            : `${date.month() + 1}`,
        );
        setDays(generateDays(date.year(), date.month() + 1));
      }
      if (!expirationMode) {
        if (calendarType === "jalali") {
          scrollToSelected(
            "days",
            date.jDate() < 10 ? `0${date.jDate()}` : `${date.jDate()}`,
          );
        } else {
          scrollToSelected(
            "days",
            date.date() < 10 ? `0${date.date()}` : `${date.date()}`,
          );
        }
      }
    }
  }, [domLoaded]);

  useEffect(() => {
    if (calendarType === "jalali")
      setDays(generateDays(date.jYear(), date.jMonth() + 1));
    else setDays(generateDays(date.year(), date.month() + 1));
  }, [date]);

  const generateYears = () => {
    let startYear;
    let endYear;
    if (expirationMode) {
      endYear =
        calendarType === "jalali" ? moment(today).jYear() : today.getFullYear();
      startYear =
        calendarType === "jalali"
          ? moment(today).jYear() + 7
          : today.getFullYear() + 7;
    } else {
      endYear = calendarType === "jalali" ? 1270 : 1891;
      startYear =
        calendarType === "jalali"
          ? moment(today).jYear() - 13
          : today.getFullYear() - 13;
    }
    const yearsArray = [];
    for (let year = startYear; year >= endYear; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  };

  const generateMonths = () => {
    const monthsFa = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];

    const monthsEn = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (calendarType === "jalali" ? monthsFa : monthsEn).map(
      (month, index) => ({
        id: index + 1,
        name: month,
      }),
    );
  };

  const generateDays = (year, month) => {
    const daysInMonth =
      calendarType === "jalali"
        ? moment.jDaysInMonth(year, month - 1)
        : moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate =
        calendarType === "jalali"
          ? moment(`${year}-${month}-${day}`, "jYYYY-jMM-jDD")
              .format("jYYYY-jMM-jDD")
              .split("-")[2]
          : moment(`${year}-${month}-${day}`, "YYYY-MM-DD").format("DD");
      days.push(formattedDate);
    }
    return days;
  };

  const mapMonth = (input, region) => {
    const monthMap = {
      fa: {
        "01": "فروردین",
        "02": "اردیبهشت",
        "03": "خرداد",
        "04": "تیر",
        "05": "مرداد",
        "06": "شهریور",
        "07": "مهر",
        "08": "آبان",
        "09": "آذر",
        10: "دی",
        11: "بهمن",
        12: "اسفند",
      },
      en: {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        10: "October",
        11: "November",
        12: "December",
      },
    };

    if (!isNaN(input)) {
      return monthMap[region][input] || "Invalid Month Number";
    } else {
      for (let key in monthMap[region]) {
        if (monthMap[region][key] === input) {
          return key;
        }
      }
      return "Invalid Month Name";
    }
  };

  const scrollToSelected = (elementName, selectedValue) => {
    const elements = document.getElementsByName(elementName);
    for (let i = 0; i < elements.length; i++) {
      if (
        elements[i].innerText === selectedValue ||
        mapMonth(selectedValue, type) === elements[i].innerText
      ) {
        const targetItem = elements[i];
        const containerRef =
          elementName === "years"
            ? yearsRef.current
            : elementName === "months"
              ? monthsRef.current
              : daysRef.current;
        if (containerRef && targetItem) {
          const containerRect = containerRef.getBoundingClientRect();
          const itemRect = targetItem.getBoundingClientRect();
          const targetPosition =
            itemRect.top -
            containerRect.top +
            containerRef.scrollTop -
            itemRect.height;
          containerRef.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
        break;
      }
    }
  };

  const handleSetDate = (name) => {
    const elements = document.getElementsByName(name);
    const centerLine =
      document.getElementById("date-picker-container").getBoundingClientRect()
        .y + 75;

    for (let i = 0; i < elements.length; i++) {
      const divStart = elements[i].getBoundingClientRect().y;
      const divEnd = divStart + 38;

      if (
        (divStart < centerLine && divEnd > centerLine) ||
        divEnd === centerLine ||
        divStart === centerLine ||
        Math.abs(divStart - centerLine) < 15 ||
        Math.abs(divEnd - centerLine) < 15
      ) {
        const value = elements[i].innerText;

        if (name === "days") {
          setDate(
            calendarType === "jalali"
              ? moment(
                  `${date.jYear()}/${date.jMonth() + 1}/${value}`,
                  "jYYYY/jMM/jDD",
                )
              : moment(
                  `${date.year()}/${date.month() + 1}/${value}`,
                  "YYYY/MM/DD",
                ),
          );
          scrollToElement("days-container", i);
        } else if (name === "months") {
          setDate(
            calendarType === "jalali"
              ? moment(
                  `${date.jYear()}/${mapMonth(value, type)}/${date.jDate()}`,
                  "jYYYY/jMM/jDD",
                )
              : moment(
                  `${date.year()}/${mapMonth(value, type)}/${date.date()}`,
                  "YYYY/MM/DD",
                ),
          );
          scrollToElement("months-container", i);
        } else if (name === "years") {
          setDate(
            calendarType === "jalali"
              ? moment(
                  `${value}/${date.jMonth() + 1}/${date.jDate()}`,
                  "jYYYY/jMM/jDD",
                )
              : moment(
                  `${value}/${date.month() + 1}/${date.date()}`,
                  "YYYY/MM/DD",
                ),
          );
          scrollToElement("years-container", i);
        }
        break;
      }
    }
  };

  const scrollToElement = (containerId, index) => {
    const container = document.getElementById(containerId);
    if (container) {
      container.scrollTo({
        top: index * 50,
        behavior: "smooth",
      });
    }
  };

  return (
    domLoaded && (
      <div
        className={`grid max-h-[150px] w-full ${expirationMode ? "grid-cols-2" : "grid-cols-3"} gap-2 text-neutrall-900`}
        id="date-picker-container"
        style={{ direction: "rtl" }}
      >
        {!expirationMode && (
          <DateColumn
            ref={daysRef}
            id="days-container"
            name="days"
            values={days}
            selectedValue={
              calendarType === "jalali" ? date.jDate() : date.date()
            }
            handleSetDate={handleSetDate}
          />
        )}
        <DateColumn
          ref={monthsRef}
          id="months-container"
          name="months"
          values={generateMonths()}
          selectedValue={
            calendarType === "jalali" ? date.jMonth() + 1 : date.month() + 1
          }
          handleSetDate={handleSetDate}
          expirationMode={expirationMode}
        />
        <DateColumn
          ref={yearsRef}
          id="years-container"
          name="years"
          values={generateYears()}
          selectedValue={calendarType === "jalali" ? date.jYear() : date.year()}
          handleSetDate={handleSetDate}
          expirationMode={expirationMode}
        />
      </div>
    )
  );
};

const DateColumn = React.forwardRef(
  ({ id, name, values, selectedValue, handleSetDate }, ref) => (
    <div
      ref={ref}
      id={id}
      className="scrollbar-hide relative col-span-1 max-h-[150px] w-full cursor-pointer overflow-y-scroll"
      style={{ touchAction: "pan-y" }}
      onTouchEnd={() => handleSetDate(name)}
    >
      <div className="sticky top-[50px] z-10 h-[1px] w-full bg-primary-500" />
      <div className="sticky top-[99px] z-10 h-[1px] w-full bg-primary-500" />
      <div className="flex h-[50px] items-center justify-center p-3 text-sm font-normal" />
      {values.map((value, index) => (
        <div
          name={name}
          key={index}
          className={`flex h-[50px] items-center justify-center p-3 text-sm font-normal ${selectedValue == value || selectedValue == value.id ? "text-black" : "text-neutrall-400"}`}
        >
          {name === "months" ? value.name : value}
        </div>
      ))}
      <div className="flex h-[50px] items-center justify-center p-3 text-sm font-normal" />
    </div>
  ),
);

DateColumn.displayName = "DateColumn";

export default MobileDatePicker;
