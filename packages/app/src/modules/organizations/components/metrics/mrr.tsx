import * as React from 'react'

import { Card, CardBody } from '@saas-ui/react'

import { LineChart, LineChartProps, ChartData } from '@saas-ui/charts'

import { format, subDays, eachDayOfInterval } from 'date-fns'
import {formatNumber} from '@app/i18n'

// @todo move this to Graphql mock
const createData = ({
  date = new Date(),
}: {
  date?: Date
}): ChartData[] => {
  const start = subDays(date, 30)

  const days = eachDayOfInterval({
    start,
    end: date,
  })

  let r = 30000

  return days.map((date) => {
    r = r += Math.random() * 1000

    return {
      xv: format(date, 'd/L'),
      x: date.getTime(),
      y: r,
      yv: formatNumber(r, 'EUR'),
    }
  })
}

export const MRR = () => {
  const data = React.useMemo(() => createData({}), [])

  return (
    <Card title="Monthly recurring revenue">
      <CardBody>
        <LineChart
          data={data}
          name="Revenue"
          tickFormatter={(value: number) => formatNumber(value, 'EUR', 0)}
          height="290px"
        />
      </CardBody>
    </Card>
  )
}
