import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isToday, startOfWeek, addDays, isSameDay } from "date-fns";
import { DayPicker } from 'react-day-picker';
import { DateRange } from "react-day-picker";

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
}

export default function AgentSchedule() {
  const [date, setDate] = useState<Date>(new Date());
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: new Date(2024, 0, 27),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Property Inspection",
      description: "Inspect the property for any damages or maintenance issues.",
      date: new Date(2024, 3, 10),
      time: "10:00 AM",
      status: "scheduled"
    },
    {
      id: "task-2",
      title: "Tenant Meeting",
      description: "Meet with the tenant to discuss lease renewal.",
      date: new Date(2024, 3, 12),
      time: "02:00 PM",
      status: "scheduled"
    },
    {
      id: "task-3",
      title: "Maintenance Request",
      description: "Fix the leaking faucet in the bathroom.",
      date: new Date(2024, 3, 15),
      time: "11:00 AM",
      status: "in_progress"
    },
    {
      id: "task-4",
      title: "Lease Signing",
      description: "Sign the lease agreement with the new tenant.",
      date: new Date(2024, 3, 18),
      time: "03:00 PM",
      status: "scheduled"
    },
    {
      id: "task-5",
      title: "Property Valuation",
      description: "Get the property valued for insurance purposes.",
      date: new Date(2024, 3, 20),
      time: "09:00 AM",
      status: "completed"
    },
    {
      id: "task-6",
      title: "Tenant Move-in",
      description: "Assist the tenant with moving into the property.",
      date: new Date(2024, 3, 22),
      time: "12:00 PM",
      status: "scheduled"
    },
    {
      id: "task-7",
      title: "Eviction Notice",
      description: "Serve the eviction notice to the tenant.",
      date: new Date(2024, 3, 25),
      time: "04:00 PM",
      status: "cancelled"
    },
  ]);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const numberOfDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const days = [];
  let day = startOfWeek(date);

  for (let i = 0; i < 7; i++) {
    days.push(addDays(day, i));
  }

  const Day = ({ day, className }: { day: number, className?: string }) => {
    return (
      <div className={className}>
        {day}
      </div>
    );
  };

  return (
    <DashboardLayout requiredPermission="view:schedule">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Schedule</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} data-state={date ? "active" : "inactive"}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={date}
                  onSelect={setDate}
                  className="border-none shadow-md"
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !range && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {range?.from ? (
                    range.to ? (
                      `${format(range.from, "MMM dd, yyyy")} - ${format(range.to, "MMM dd, yyyy")}`
                    ) : (
                      format(range.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <DayPicker
                  mode="range"
                  defaultMonth={date}
                  selected={range}
                  onSelect={setRange}
                  numberOfMonths={2}
                  pagedNavigation
                  className="border-none shadow-md"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          {days.map(day => (
            <Card key={format(day, "yyyy-MM-dd")}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{format(day, "EEE dd")}</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <ul className="space-y-2">
                  {filteredTasks.filter(task => isSameDay(task.date, day)).map(task => (
                    <li key={task.id} className="flex items-center justify-between">
                      <span className="text-sm">{task.title}</span>
                      <Button variant="outline" size="icon" onClick={() => handleViewTask(task)}>
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
              <div className="relative bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-lg font-bold mb-4">{selectedTask.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{selectedTask.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(selectedTask.date, "MMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedTask.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{selectedTask.status}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" onClick={() => setShowTaskDetails(false)}>Close</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
