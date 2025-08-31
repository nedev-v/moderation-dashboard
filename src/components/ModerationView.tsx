import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ModerationResponse, ViolationType } from "@/types";
import { ReviewStatusSelector } from "./ReviewStatusSelector";

interface ModerationViewProps {
  selectedAudio: ModerationResponse | null;
  isViewOpen: boolean;
  setIsViewOpen: (open: boolean) => void;
  setAudios: React.Dispatch<React.SetStateAction<ModerationResponse[]>>;
}

export default function ModerationView({ selectedAudio, isViewOpen, setIsViewOpen, setAudios }: ModerationViewProps) {
  if (!selectedAudio) return null;

  const riskColors: Record<ViolationType, string> = {
    high_risk: "bg-red-100 text-red-800",
    medium_risk: "bg-yellow-100 text-yellow-800",
    low_risk: "bg-green-100 text-green-800",
  };

  function onChangeStatus(statusVal: "Pending" | "Approved" | "Blocked") {
    if (!selectedAudio) return;
    setIsViewOpen(false);
    setAudios((prevAudios: ModerationResponse[]) => 
      prevAudios.map((audio) =>
        audio.id === selectedAudio.id
          ? { ...audio, reviewStatus: statusVal }
          : audio
      )
    );
  }

  return (
    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Moderation Results</DialogTitle>
          <DialogDescription>
            Detailed analysis for <strong>{selectedAudio.originalName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p>
            <strong>Status:</strong>{" "}
            {selectedAudio.flagged ? (
              <Badge className="bg-red-100 text-red-800">Flagged</Badge>
            ) : (
              <Badge className="bg-green-100 text-green-800">Safe</Badge>
            )}
          </p>

          <div>
            <strong>Transcriptions:</strong>
            <div className="mt-2 space-y-2">
                {Object.entries(selectedAudio.transcription).map(([lang, text]) => (
                <div
                    key={lang}
                    className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-3 shadow-sm"
                >
                    <span className="font-semibold mr-1">{lang}:</span>
                    <span>{text}</span>
                </div>
                ))}
            </div>
            </div>

          <div>
            <strong>Violations:</strong>
            <div className="mt-2 space-y-4">
                {(["high_risk", "medium_risk", "low_risk"] as ViolationType[]).map((risk) => {
                const items = selectedAudio.violations[risk];
                if (!items || items.length === 0) return null; 

                return (
                    <div key={risk} className="space-y-1">
                    <Badge className={`${riskColors[risk]} px-3 py-1 mb-2`}>
                        {risk.replace("_", " ")} ({items.length})
                    </Badge>
                    <div className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-800">
                        <ul className="list-none ml-4 space-y-1">
                        {items.map(([category, score], idx) => (
                            <li key={idx}>
                                <span className="font-semibold">{category}</span> — {Math.round(score * 100)}%
                            </li>
                        ))}
                        </ul>
                    </div>
                    </div>
                );
                })}
                {Object.entries(selectedAudio.violations).length === 0 && (
                <Badge className="bg-green-100 text-green-800">No Violations</Badge>
                )}
              </div>
          </div>
          <div>
            <ReviewStatusSelector value={selectedAudio.reviewStatus} onChange={onChangeStatus} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
