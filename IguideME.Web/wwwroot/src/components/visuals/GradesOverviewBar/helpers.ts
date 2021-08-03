export const createLineData = (grades: number[]) => {
  return {
    labels: grades.sort((a, b) =>
      a - b).map(s => s.toString()),
    datasets: [
      {
        label: "Grades",
        borderColor: "rgb(90, 50, 255)",
        backgroundColor: "rgba(90, 50, 255, 0.4)",
        pointRadius: 0,
        data: grades.sort((a, b) =>
          a - b)
      }
    ]
  }
}

export const createBarData = (grades: number[], binary: boolean) => {
  return {
    labels: binary ? ['0', '1'] : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [{
      label: "Failed",
      backgroundColor: "rgb(255,110,90)",
      data: binary ?
        [
          grades.filter(s => s === 0).length,
          0,
        ] : [
        grades.filter(s => Math.floor(s) === 0).length,
        grades.filter(s => Math.floor(s) === 1).length,
        grades.filter(s => Math.floor(s) === 2).length,
        grades.filter(s => Math.floor(s) === 3).length,
        grades.filter(s => Math.floor(s) === 4).length,
        grades.filter(s => Math.floor(s) === 5 && s < 5.5).length,
        0,
        0,
        0,
        0,
        0
      ]
    }, {
      label: "Passed",
      backgroundColor: "rgb(0, 185, 125)",
      data: binary ?
        [
          0,
          grades.filter(s => s === 1).length,
        ] : [
        0,
        0,
        0,
        0,
        0,
        grades.filter(s => Math.floor(s) === 5 && s >= 5.5).length,
        grades.filter(s => Math.floor(s) === 6).length,
        grades.filter(s => Math.floor(s) === 7).length,
        grades.filter(s => Math.floor(s) === 8).length,
        grades.filter(s => Math.floor(s) === 9).length,
        grades.filter(s => Math.floor(s) === 10).length,
      ]
    }]
  }
}

export const getLineOptions = () => {
  return {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines : {
          display : false
        },
        ticks: {
          display: false
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Grade'
        }
      }]
    }
  }
}

export const getBarOptions = (withLegend: boolean) => {
  return {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines : {
          display : false
        },
        scaleLabel: {
          display: withLegend,
          labelString: 'Grade'
        },
        stacked: true,
      }],
      yAxes: [{
        scaleLabel: {
          display: withLegend,
          labelString: '# of students'
        },
        stacked: true
      }]
    }
  }
}