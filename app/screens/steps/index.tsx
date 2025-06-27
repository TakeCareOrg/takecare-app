import { View } from "react-native";

import { Text } from "@app/components/ui/text";
import useHealthData from "@app/hooks/health/use-health-data";
import { PageContainer } from "@app/layouts/page-container";
import { addDays } from "date-fns";
import { PeriodSwitch } from "@app/components/ui/period-switch";
import { DailyBarChart } from "@app/components/ui/chart/daily-bar-chart";

const sampleData = [
  { day: '02', value: 10, secondaryValue: 30 },
  { day: '03', value: 60, secondaryValue: 30 },
  { day: '04', value: 50, secondaryValue: 30 },
  { day: '05', value: 40, secondaryValue: 30 },
  { day: '06', value: 10, secondaryValue: 30 },
  { day: '07', value: 30, secondaryValue: 30 },
  { day: '08', value: 20, secondaryValue: 30 },
  { day: '09', value: 20, secondaryValue: 45 },
  { day: '10', value: 50 },
  { day: '11', value: 25, secondaryValue: 40 },
  { day: '12', value: 70 },
  { day: '13', value: 45, secondaryValue: 20 },
  { day: '14', value: 35, secondaryValue: 55 },
  { day: '15', value: 45, secondaryValue: 25 },
  { day: '16', value: 90 },
  { day: '17', value: 85 },
  { day: '18', value: 95 },
  { day: '19', value: 30, secondaryValue: 60 },
  { day: '20', value: 80 },
  { day: '21', value: 40, secondaryValue: 50 },
];

export function StepsScreen() {
    const { steps, flights, distance } = useHealthData(addDays(new Date(), -1));

    return (
        <PageContainer>
          <PeriodSwitch />
          <DailyBarChart 
            data={sampleData} 
            referenceLines={[{ value: 30, label: '30' }, { value: 60, label: '60' }]}
          />
        </PageContainer>
    );
}
