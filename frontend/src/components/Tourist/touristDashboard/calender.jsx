import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, PickerDay } from '@mui/x-date-pickers';

function HighlightedDay({ day, startDate, endDate, ...props }) {
  if (!startDate || !endDate) return <PickerDay day={day} {...props} />;

  const isStart = day.isSame(startDate, 'day');
  const isEnd = day.isSame(endDate, 'day');
  const isInRange = day.isAfter(startDate, 'day') && day.isBefore(endDate, 'day');

  return (
    <div
      style={{
        backgroundColor: isInRange || isStart || isEnd ? '#eff6ff' : 'transparent',
        // no gap — flush rectangles between start and end, rounded caps only on edges
        borderRadius: isStart
          ? '10px 0 0 10px'
          : isEnd
          ? '0 10px 10px 0'
          : isInRange
          ? '0'
          : '10px',
        width: '100%',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
      }}
    >
      <PickerDay
        day={day}
        {...props}
        sx={{
          width: '32px',
          height: '32px',
          minWidth: '32px',
          fontSize: '13px',
          lineHeight: '32px',
          margin: 0,
          padding: 0,
          backgroundColor: isStart || isEnd
            ? '#3b82f6 !important'
            : 'transparent !important',
          color: isStart || isEnd
            ? '#fff !important'
            : isInRange
            ? '#1d4ed8 !important'
            : 'inherit',
          fontWeight: isStart || isEnd ? 700 : isInRange ? 600 : 400,
          borderRadius: '10px !important',
          '&:hover': {
            backgroundColor: isStart || isEnd
              ? '#2563eb !important'
              : '#bfdbfe !important',
          },
          '&.MuiPickersDay-today': {
            border: isStart || isEnd ? 'none' : '1.5px solid #93c5fd',
          },
        }}
      />
    </div>
  );
}

export default function TripCalendar({ startDate, endDate }) {
  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={startDate ?? null}
          onChange={() => {}}
          slots={{ day: HighlightedDay }}
          slotProps={{
            day: { startDate, endDate },
          }}
          sx={{
            width: '100%',
            '& .MuiDayCalendar-weekContainer': {
              justifyContent: 'space-between',
              margin: '1px 0',
              gap: 0,
            },
            '& .MuiDayCalendar-header': {
              justifyContent: 'space-between',
            },
            '& .MuiPickersDay-root': {
              margin: 0,
            },
            '& .MuiDayCalendar-weekDayLabel': {
              fontSize: '11px',
              fontWeight: 500,
              color: '#94a3b8',
              width: '36px',
            },
            '& .MuiPickersCalendarHeader-label': {
              fontWeight: 700,
              fontSize: '15px',
            },
            '& .MuiDayCalendar-slideTransition': {
              minHeight: '220px',
            },
          }}
        />
      </LocalizationProvider>
      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
        <div className="w-3 h-3 bg-blue-50 border border-blue-100 rounded" />
        <span>Trip Duration</span>
      </div>
    </div>
  );
}