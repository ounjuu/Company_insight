// components/Modal/DeleteModal.tsx
"use client";

type DeleteModalProps = {
  count?: number; // 삭제할 항목 개수
  onClose: () => void;
  onConfirm: () => void;
  message?: string; // 커스텀 메시지 가능
};

export default function DeleteModal({
  count = 0,
  onClose,
  onConfirm,
  message,
}: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-96">
        <h2 className="text-lg font-bold mb-2">삭제 확인</h2>
        <p className="mb-4">
          {message
            ? message
            : `총 ${count}개 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.`}
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
