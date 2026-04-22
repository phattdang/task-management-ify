import TaskActionsMenu from "../task-setting/TaskActionsMenu";

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
      <p className="text-sm text-slate-900 dark:text-slate-100 font-medium line-clamp-2">
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
              ? "opacity-100 bg-slate-100 dark:bg-slate-800/50"
              : "opacity-0 group-hover:opacity-100"
          } text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 p-1 rounded`}
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
