import { QuizOptionId, purposeQuestion } from "@/lib/quizQuestions";

type PurposeQuestionProps = {
  selected: QuizOptionId | QuizOptionId[] | undefined;
  onChange: (next: QuizOptionId | QuizOptionId[]) => void;
};

const ICONS: Record<string, string> = {
  purpose_companion: "👨‍👩‍👧‍👦",
  purpose_guard: "🏠",
  purpose_active: "🏃",
  purpose_support: "❤️",
  purpose_service: "🦮",
  purpose_friend: "🐕",
};

export default function PurposeQuestion({
  selected,
  onChange,
}: PurposeQuestionProps) {
  // Normalize selected to array
  const selectedArray = Array.isArray(selected)
    ? selected
    : selected
    ? [selected]
    : [];

  const handleSelect = (id: QuizOptionId) => {
    if (selectedArray.includes(id)) {
      // Deselect
      const newSelection = selectedArray.filter((item) => item !== id);
      onChange(newSelection);
    } else {
      // Select (up to 3)
      if (selectedArray.length < 3) {
        onChange([...selectedArray, id]);
      }
    }
  };

  const handleReset = () => {
    onChange([]);
  };

  // Podium slots
  const firstPlace = selectedArray[0];
  const secondPlace = selectedArray[1];
  const thirdPlace = selectedArray[2];

  const getOptionLabel = (id: QuizOptionId | undefined) => {
    if (!id) return null;
    return purposeQuestion.options.find((opt) => opt.id === id)?.label;
  };

  const getOptionIcon = (id: QuizOptionId | undefined) => {
    if (!id) return null;
    return ICONS[id as string] || "🐾";
  };

  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="h3 mb-2">{purposeQuestion.title}</h2>
        <p className="text-muted">
          Select up to 3 priorities in order of importance.
        </p>
      </div>

      {/* Podium / Ranked Display */}
      <div className="mb-5">
        <div className="d-flex justify-content-center align-items-end gap-2 gap-md-4" style={{ minHeight: "180px" }}>
          
          {/* 2nd Place */}
          <div className="text-center order-1" style={{ width: "30%" }}>
            <div className="mb-2 fw-bold text-primary">2nd</div>
            <div 
              className={`rounded-4 p-2 d-flex flex-column align-items-center justify-content-center border transition-all ${
                secondPlace 
                  ? "bg-white border-primary shadow-sm opacity-100" 
                  : "bg-light border-2 border-dashed border-secondary opacity-100"
              }`}
              style={{ height: "120px" }}
            >
              {secondPlace ? (
                <>
                  <div className="fs-1 mb-1">{getOptionIcon(secondPlace)}</div>
                  <small className="lh-1 fw-medium" style={{ fontSize: "0.75rem" }}>
                    {getOptionLabel(secondPlace)}
                  </small>
                </>
              ) : (
                <span className="fw-bold text-uppercase opacity-100 text-dark" style={{ fontSize: "0.8rem", color: "#000 !important" }}>
                  2nd<br/>Priority
                </span>
              )}
            </div>
          </div>

          {/* 1st Place */}
          <div className="text-center order-2" style={{ width: "35%", marginBottom: "20px" }}>
            <div className="mb-2 fw-bold text-primary">1st Priority</div>
            <div 
              className={`rounded-4 p-3 d-flex flex-column align-items-center justify-content-center border border-2 transition-all ${
                firstPlace 
                  ? "bg-white border-primary shadow opacity-100" 
                  : "bg-light-subtle border-dashed border-secondary opacity-100"
              }`}
              style={{ height: "150px" }}
            >
              {firstPlace ? (
                <>
                  <div className="display-4 mb-2">{getOptionIcon(firstPlace)}</div>
                  <small className="lh-1 fw-bold">
                    {getOptionLabel(firstPlace)}
                  </small>
                </>
              ) : (
                <span className="fw-bold text-uppercase text-center opacity-100 text-dark" style={{ color: "#000 !important" }}>
                  Main<br/>Goal
                </span>
              )}
            </div>
          </div>

          {/* 3rd Place */}
          <div className="text-center order-3" style={{ width: "30%" }}>
            <div className="mb-2 fw-bold text-primary">3rd</div>
            <div 
              className={`rounded-4 p-2 d-flex flex-column align-items-center justify-content-center border transition-all ${
                thirdPlace 
                  ? "bg-white border-primary shadow-sm opacity-100" 
                  : "bg-light-subtle border-2 border-dashed border-secondary opacity-100"
              }`}
              style={{ height: "100px" }}
            >
              {thirdPlace ? (
                <>
                  <div className="fs-2 mb-1">{getOptionIcon(thirdPlace)}</div>
                  <small className="lh-1 fw-medium" style={{ fontSize: "0.7rem" }}>
                    {getOptionLabel(thirdPlace)}
                  </small>
                </>
              ) : (
                <span className="fw-bold text-uppercase opacity-100 text-dark" style={{ fontSize: "0.7rem", color: "#000 !important" }}>
                  3rd<br/>Priority
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-3" style={{ minHeight: "38px" }}>
          <button 
            onClick={handleReset}
            className={`btn btn-sm btn-outline-danger rounded-pill px-3 ${selectedArray.length === 0 ? "invisible" : "visible"}`}
          >
            Reset Selection
          </button>
        </div>
      </div>

      {/* Options Grid */}
      <div className="row g-3 justify-content-center">
        {purposeQuestion.options.map((option) => {
          const isSelected = selectedArray.includes(option.id as QuizOptionId);
          const selectionIndex = selectedArray.indexOf(option.id as QuizOptionId); // 0, 1, 2
          const rank = selectionIndex >= 0 ? selectionIndex + 1 : null;
          
          const icon = ICONS[option.id] || "🐾";

          return (
            <div key={option.id} className="col-12 col-md-6 col-lg-4">
              <button
                type="button"
                className={`w-100 border-0 p-0 text-start h-100 position-relative bg-transparent`}
                onClick={() => handleSelect(option.id as QuizOptionId)}
                disabled={!isSelected && selectedArray.length >= 3}
                style={{ opacity: !isSelected && selectedArray.length >= 3 ? 0.85 : 1 }}
              >
                <div
                  className={`rounded-4 p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center transition-all ${
                    isSelected
                      ? "bg-primary-subtle border border-2 border-primary shadow-sm"
                      : "bg-white border border-1 border-secondary-subtle shadow-sm hover-shadow text-dark"
                  }`}
                  style={{ minHeight: "140px" }}
                >
                  <div className="display-4 mb-3">{icon}</div>
                  <span className="fw-semibold fs-5">{option.label}</span>
                </div>
                
                {rank && (
                  <div 
                    className="position-absolute top-0 end-0 m-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: "32px", height: "32px", fontWeight: "bold" }}
                  >
                    {rank}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
