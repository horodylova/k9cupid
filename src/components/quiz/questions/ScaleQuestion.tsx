type ScaleLabel = {
  value: number;
  label: string;
};

type ScaleQuestionProps = {
  title: string;
  subtitle?: string;
  labels: ScaleLabel[];
  value?: number;
  onChange: (value: number) => void;
};

export default function ScaleQuestion({
  title,
  subtitle,
  labels,
  value,
  onChange,
}: ScaleQuestionProps) {
  const sortedLabels = [...labels].sort((a, b) => a.value - b.value);

  return (
    <div className="h-100 d-flex flex-column">
      <div className="mb-3 text-center text-md-start">
        <h1 className="h4 mb-1">{title}</h1>
        {subtitle ? <p className="mb-0 text-muted">{subtitle}</p> : null}
      </div>
      <div className="row g-3 mt-2">
        {sortedLabels.map((item) => {
          const isSelected = value === item.value;

          return (
            <div key={item.value} className="col-12 col-sm-6 col-lg">
              <button
                type="button"
                className={`w-100 border-0 bg-transparent p-0 text-start h-100`}
                onClick={() => onChange(item.value)}
              >
                <div
                  className={`rounded-4 h-100 d-flex flex-column justify-content-between p-3 p-md-4 ${
                    isSelected
                      ? "border border-2 border-primary bg-white"
                      : "border border-2 border-transparent bg-light"
                  }`}
                >
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className={`rounded-circle d-inline-flex align-items-center justify-content-center me-3 ${
                        isSelected ? "bg-primary text-white" : "bg-white text-primary"
                      }`}
                      style={{ width: 32, height: 32 }}
                    >
                      {item.value}
                    </div>
                    <div className="fw-semibold">{item.label}</div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
