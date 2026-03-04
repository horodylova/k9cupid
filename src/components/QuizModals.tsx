import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearQuizSession } from "@/lib/quizStorage";

interface QuizStartOverModalProps {
  onCancel: () => void;
}

export function QuizStartOverModal({ onCancel }: QuizStartOverModalProps) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
    >
      <div
        className="rounded-4 p-4 p-md-5 shadow-lg"
        style={{ maxWidth: 720, width: "100%", background: "#FFF7EC" }}
      >
        <div className="row g-4 align-items-center mb-4">
          <div className="col-md-4 text-center text-md-start">
            <Image
              src="/Cupid with Dogs-white-puppy.png"
              alt="Cupid with dog illustration"
              width={120}
              height={120}
              className="img-fluid"
            />
            <h2 className="h5 mb-0 mt-3">Start from scratch?</h2>
          </div>
          <div className="col-md-8">
            <p className="mb-0">
              Are you sure you want to start over? All your progress will be lost.
            </p>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary flex-fill"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger flex-fill"
            onClick={() => {
              clearQuizSession();
              window.location.reload();
            }}
          >
            Yes, start over
          </button>
        </div>
      </div>
    </div>
  );
}

interface QuizLeaveModalProps {
  pendingHref: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function QuizLeaveModal({ pendingHref, onCancel, onConfirm }: QuizLeaveModalProps) {
  const router = useRouter();

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
    >
      <div
        className="rounded-4 p-4 p-md-5 shadow-lg"
        style={{ maxWidth: 720, width: "100%", background: "#FFF7EC" }}
      >
        <div className="row g-4 align-items-center mb-4">
          <div className="col-md-4 text-center text-md-start">
            <Image
              src="/Cupid with Dogs-white-puppy.png"
              alt="Cupid with dog illustration"
              width={120}
              height={120}
              className="img-fluid"
            />
            <h2 className="h5 mb-0 mt-3">Need a little break?</h2>
          </div>
          <div className="col-md-8">
            <p className="mb-0">
              We will keep your quiz answers safe on this device for 24 hours,
              so you and your future dog can return and continue together.
            </p>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-primary flex-fill"
            onClick={onCancel}
          >
            Keep going
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary flex-fill"
            onClick={() => {
              clearQuizSession();
              onConfirm(); // Close modal state in parent
              if (pendingHref) {
                router.push(pendingHref);
              }
            }}
          >
            Leave without saving
          </button>
          <button
            type="button"
            className="btn btn-link text-decoration-none flex-fill"
            onClick={() => {
              onConfirm(); // Close modal state in parent
              if (pendingHref) {
                router.push(pendingHref);
              }
            }}
          >
            Save and come back later
          </button>
        </div>
      </div>
    </div>
  );
}
