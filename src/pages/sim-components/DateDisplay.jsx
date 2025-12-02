import moment from 'moment';

const DateDisplay = ({ date, formatNeeded='DD MMM YYYY hh:mm A' }) => {
    const formattedDate = moment(date).format(formatNeeded);
    return (
        <>
            {formattedDate}
        </>
    )
};

export default DateDisplay;
