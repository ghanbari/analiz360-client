export default {
  legend: {
    show: true,
    showForSingleSeries: true
  },
  chart: {
    stacked: false,
    zoom: {
      type: 'x',
      enabled: true
    },
    toolbar: {
      autoSelected: 'zoom'
    }
  },
  plotOptions: {
    line: {
      curve: 'smooth'
    }
  },
  dataLabels: {
    enabled: false
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter (val) {
        return (new Date(val)).toLocaleDateString('fa-IR')
      }
    }
  },

  tooltip: {
    shared: false,
    x: {
      formatter (val) {
        return (new Date(val)).toLocaleDateString('fa-IR')
      }
    }
  }
}
