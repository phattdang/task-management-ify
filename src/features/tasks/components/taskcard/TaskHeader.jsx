export default function TaskHeader({
  taskName,
  menuRef,
  isMenuOpen,
  setIsMenuOpen,
  onDeleteClick,
  onCopyId,
}) {
  return (
    <div className="flex justify-between items-start mb-2">
      <p className="text-sm text-gray-800 font-medium line-clamp-2">
        {taskName}
      </p>
      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className={`transition-opacity ${
            isMenuOpen
              ? "opacity-100 bg-gray-100"
              : "opacity-0 group-hover:opacity-100"
          } text-gray-400 hover:bg-gray-100 p-1 rounded`}
        >
          •••
        </button>
        {isMenuOpen && (
          <TaskActionsMenu
            onClose={() => setIsMenuOpen(false)}
            onDeleteClick={onDeleteClick}
            onCopyId={onCopyId}
          />
        )}
      </div>
    </div>
  );
}
