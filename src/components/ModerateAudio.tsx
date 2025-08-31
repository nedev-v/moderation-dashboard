import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAudioModerationUpload } from "@/hooks/useAudioModerationUpload"
import type { ModerationResponse } from "@/types"
import { useEffect, useState } from "react"

function ModerateAudio({ setAudios, setNewAudioId }: { setAudios: React.Dispatch<React.SetStateAction<ModerationResponse[]>>, setNewAudioId: React.Dispatch<React.SetStateAction<string | null>> }) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const { uploadAudio, loading, error, result, reset } = useAudioModerationUpload();
  
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        uploadAudio(file)
    }
    useEffect(() => {
        if (result) {
            result.reviewStatus = "Pending";
            setAudios((prevAudios) => [...prevAudios, result]);
            setNewAudioId(result.id);
            setIsAddOpen(false);
        }
    }, [result]);

  return (
    <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audio Moderation Dashboard</h1>
        <Dialog open={isAddOpen} 
            onOpenChange={(open) => {
                setIsAddOpen(open);
                if (!open) reset(); 
            }}
        >
          <DialogTrigger asChild>
            <Button>Add Audio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Audio for Moderation</DialogTitle>
              <DialogDescription>
                Drop or select an audio file to process and view moderation results.
              </DialogDescription>
            </DialogHeader>
            <Input type="file" accept="audio/*" onChange={handleFileUpload} />
            {loading && (
                <div className="flex justify-center mt-4">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )}
            {error && <p>Error: {error}</p>}
          </DialogContent>
        </Dialog>
      </div>
  )
}

export default ModerateAudio;