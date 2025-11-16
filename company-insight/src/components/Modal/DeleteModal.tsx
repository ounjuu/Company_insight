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
      <div className="bg-white rounded w-[400px] h-[440px] gap-[32px] p-[24px] flex flex-col justify-center">
        {/* 닫기 버튼 */}
        <div className="w-[352px] flex justify-end">
          <button
            onClick={onClose}
            className="w-10 h-10 flex justify-center items-center font-bold text-lg transition"
          >
            ✕
          </button>
        </div>

        {/* 빨간색 X 부분 */}
        <div className="flex justify-center items-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex justify-center items-center">
            <div className="w-15 h-15 border-2 border-red-500 rounded-full flex justify-center items-center">
              <svg
                className="w-6 h-6 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold h-[32px] text-center text-[24px]">
            {message
              ? message.split("\n")[0]
              : `총 ${count}개 삭제하시겠습니까?`}
          </h2>
          <p className="w-full text-center text-[16px] text-gray-600">
            {message ? (
              message
                .split("\n")
                .slice(1)
                .map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))
            ) : (
              <>
                관심기업 삭제시 복구할 수 없습니다.
                <br />
                정말 삭제하시겠습니까?
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col justify-end gap-2">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-black text-white"
          >
            삭제
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded border">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
