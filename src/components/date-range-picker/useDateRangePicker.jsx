import { useState } from 'react';
import { isSameDay, isSameMonth, getYear, isBefore } from 'date-fns';
import { fDate } from '../../utils/formatTime';
 
function computeDateChecks(startDate, endDate) {
  const isError = startDate && endDate && isBefore(new Date(endDate), new Date(startDate));
  const isSameDays = startDate && endDate && isSameDay(new Date(startDate), new Date(endDate));
  const isSameMonths = startDate && endDate && isSameMonth(new Date(startDate), new Date(endDate));
 
  return {
    isError: isError,
    isSameDays: isSameDays,
    isSameMonths: isSameMonths
  };
}
 
function formatDate(date) {
  // Assuming fDate is a function to format the date
  return fDate(new Date(date));
}
 
// Function to format a date
const formatDateFormat = (date, format) => {
  // Assuming fDate is a function to format the date
  return fDate(date, format);
};
 
function formatDateRange(startDate, endDate) {
  if (startDate && endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  } else {
    return '';
  }
}
 
// Function to get the label when dates are within the same month
const getLabelSameMonth = (startDate, endDate) => {
  return `${formatDateFormat(startDate, 'dd')} - ${formatDateFormat(endDate, 'dd MMM yy')}`;
};
 
// Function to get the label when dates are within the same year but different months
const getLabelSameYearDiffMonths = (startDate, endDate) => {
  return `${formatDateFormat(startDate, 'dd MMM')} - ${formatDateFormat(endDate, 'dd MMM yy')}`;
};
 
// Function to get the label when dates are within different years
const getLabelDiffYears = (startDate, endDate) => {
  return `${formatDateFormat(startDate, 'dd MMM yy')} - ${formatDateFormat(endDate, 'dd MMM yy')}`;
};
 
// Main function to get the short label
const getShortLabel = (startDate, endDate, isSameMonths, isSameDays,isCurrentYear) => {
  if (!startDate || !endDate) {
    return '';
  }
 
  if (isCurrentYear) {
    return handleCurrentYear(startDate, endDate, isSameMonths, isSameDays);
  }
 
  return handleDifferentYear(startDate, endDate);
};
 
const handleCurrentYear = (startDate, endDate, isSameMonths, isSameDays) => {
  if (isSameMonths && isSameDays) {
    return formatDateFormat(endDate, 'dd MMM yy');
  }
  if (isSameMonths) {
    return getLabelSameMonth(startDate, endDate);
  }
  return getLabelSameYearDiffMonths(startDate, endDate);
};
 
const handleDifferentYear = (startDate, endDate) => {
  return getLabelDiffYears(startDate, endDate);
};
 
 
export default function useDateRangePicker(start, end) {
  const [open, setOpen] = useState(false);
  const [altOpen, setAltOpen] = useState(false);
  const [endDate, setEndDate] = useState(end);
  const [startDate, setStartDate] = useState(start);
  const dateChecks = computeDateChecks(startDate, endDate);
  const isError = dateChecks.isError;
  const currentYear = new Date().getFullYear();
  const startDateYear = startDate ? getYear(startDate) : null;
  const endDateYear = endDate ? getYear(endDate) : null;
  const isCurrentYear = currentYear === startDateYear && currentYear === endDateYear;
  const isSameDays = dateChecks.isSameDays;
  const isSameMonths = dateChecks.isSameMonths;
  const standardLabel = formatDateRange(startDate, endDate);
  const startDateLabel = `${fDate(startDate)}`;
  const endDateLabel = `${fDate(endDate)}`;
 
  const onChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };
 
  const onChangeEndDate = (newValue) => {
    isError && setEndDate(null)
 
    setEndDate(newValue);
  };
 
  const onReset = (dateStart, dateEnd) => {
    //modified this function to reset the date correctly.
    setStartDate(dateStart);
    setEndDate(dateEnd);
  };
  const checkIsSelected = (startDate, endDate) => {
    return !!startDate && !!endDate;
  };
 
  return {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    open,
    altOpen,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    onAltOpen: () => setAltOpen(true),
    onAltClose: () => setAltOpen(false),
    onReset,
    isSelected: checkIsSelected(startDate, endDate),
    isError,
    label: standardLabel || '',
    shortLabel: getShortLabel(startDate, endDate, isSameMonths, isSameDays) || '',
    startDateLabel,
    endDateLabel,
    setStartDate,
    setEndDate,
  };
}
