function EventList({ date, modifiedEvent }) {
  const events = modifiedEvent[date.toDateString()] || [];
  const displayedEvents = events.slice(0, 2);
  const remainingEventsCount = events.length - 2;

  return (
    <div className="text-lg ">
      {displayedEvents.map((event, i) => (
        <div key={i} className="truncate text-blue-600">
          • {event.title}
        </div>
      ))}
      {remainingEventsCount > 0 && (
        <div className="truncate text-gray-500">
          +{remainingEventsCount} more
        </div>
      )}
    </div>
  );
}

export default EventList;
