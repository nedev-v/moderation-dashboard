import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ModerateAudio from "./ModerateAudio"
import { ViolationType, type ModerationResponse } from "@/types"
import { Badge } from "@/components/ui/badge"
import ModerationView from "./ModerationView"
import { CheckCircle, XCircle, Clock } from "lucide-react";

const statusConfig = {
  Pending: {
    icon: <Clock className="w-4 h-4 text-yellow-500" />,
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
  },
  Blocked: {
    icon: <XCircle className="w-4 h-4 text-red-500" />,
    label: "Blocked",
    className: "bg-red-100 text-red-800",
  },
  Approved: {
    icon: <CheckCircle className="w-4 h-4 text-green-500" />,
    label: "Approved",
    className: "bg-green-100 text-green-800",
  },
};


export default function Dashboard() {
  const [audios, setAudios] = useState<ModerationResponse[]>([
      {
      id: "1",
      name: "welcome_message",
      originalName: "welcome_message.mp3",
      transcription: {
        en: "Hello and welcome to our platform. We're glad you're here!",
      },
      flagged: false,
      violations: {},
      reviewStatus: "Approved"
    },
    {
      id: "2",
      name: "offensive_clip",
      originalName: "offensive_clip.wav",
      transcription: {
        en: "This is so stupid, I hate everything about this!",
      },
      flagged: true,
      violations: {
        [ViolationType.MEDIUM_RISK]: [["hate_speech", 0.72]],
      },
      reviewStatus: "Pending"
    },
    {
      id: "3",
      name: "violent_reference",
      originalName: "violent_reference.mp3",
      transcription: {
        en: "If you keep bothering me, I’ll punch you in the face.",
      },
      flagged: true,
      violations: {
        [ViolationType.HIGH_RISK]: [["violence/threats", 0.91]],
      },
      reviewStatus: "Blocked"
    },
  ])

  const [newAudioId, setNewAudioId] = useState<string | null>(null)

  const [selectedAudio, setSelectedAudio] = useState<ModerationResponse | null>(null)

  const [isViewOpen, setIsViewOpen] = useState(false)

  return (
    <div className="p-6 space-y-6">
      
      <ModerateAudio setAudios={setAudios} setNewAudioId={setNewAudioId} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Flagged</TableHead>
            <TableHead className="text-right">Violations</TableHead>
            <TableHead className="text-right">Review Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audios.map((audio, index) => { 
            const hasHighRisk = audio.violations.high_risk && audio.violations.high_risk?.length > 0 
            const hasMediumRisk = audio.violations.medium_risk && audio.violations.medium_risk?.length > 0 
            const hasLowRisk = audio.violations.low_risk && audio.violations.low_risk?.length > 0 
            const isNew = audio.id === newAudioId
            const status = statusConfig[audio.reviewStatus];
            return(
            <TableRow
              key={audio.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => {
                setSelectedAudio(audio)
                setIsViewOpen(true)
              }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell className="flex items-center space-x-2">
                {isNew && <Badge className="bg-blue-100 text-blue-800">New</Badge>}
                <span>{audio.originalName}</span>
              </TableCell>  
              <TableCell>{audio.flagged ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right space-x-2">
                {hasLowRisk && <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Low: {audio.violations.low_risk?.length ?? 0}
                </Badge>}
                {hasMediumRisk && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Medium: {audio.violations.medium_risk?.length ?? 0}
                </Badge>}
                {hasHighRisk && <Badge variant="secondary" className="bg-red-100 text-red-800">
                  High: {audio.violations.high_risk?.length}
                </Badge>}
              </TableCell>
              <TableCell>
                <div key={audio.id} className="flex items-center justify-end space-x-1 w-full">
                  {status.icon}
                  <Badge className={`${status.className} px-2 py-1 text-sm`}>
                    {status.label}
                  </Badge>
                </div>
              </TableCell>
            </TableRow>
          )
          })}
        </TableBody>
      </Table>

      <ModerationView selectedAudio={selectedAudio} isViewOpen={isViewOpen} setIsViewOpen={setIsViewOpen} setAudios={setAudios} />
    </div>
  )
}
