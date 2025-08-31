import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ReviewStatusSelectorProps {
  value: "Pending" | "Approved" | "Blocked";
  onChange: (newStatus: "Pending" | "Approved" | "Blocked") => void;
}

export function ReviewStatusSelector({ value, onChange }: ReviewStatusSelectorProps) {
  const statuses: Array<"Pending" | "Approved" | "Blocked"> = ["Pending", "Approved", "Blocked"];

  return (
    <Select
      value={value as string} 
      onValueChange={(val: string) => onChange(val as "Pending" | "Approved" | "Blocked")}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
