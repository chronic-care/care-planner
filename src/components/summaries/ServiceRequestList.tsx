import '../../Home.css'
import React from 'react'
import { FHIRData, displayTiming, displayConcept } from '../../data-services/models/fhirResources'
import { PatientSummary, ScreeningSummary } from '../../data-services/models/cqlSummary'
import { ServiceRequest, TimingRepeat } from '../../data-services/fhir-types/fhir-r4';
import { Summary, SummaryRowItems } from './Summary'

interface ServiceRequestListProps {
  fhirData?: FHIRData,
  patientSummary?: PatientSummary,
  screenings?: [ScreeningSummary]
}

export const ServiceRequestList: React.FC<ServiceRequestListProps> = (props: ServiceRequestListProps) => {

  let serviceRequests = props.fhirData?.serviceRequests

  // Sort by descending occurrenceTiming start date
  serviceRequests?.sort((sr1, sr2) => {
    let sr1BoundsPeriod = (sr1.occurrenceTiming?.repeat as TimingRepeat)?.boundsPeriod
    let sr1StartDate = sr1BoundsPeriod?.start !== undefined ? new Date(sr1BoundsPeriod.start) : undefined
    let sr2BoundsPeriod = (sr2.occurrenceTiming?.repeat as TimingRepeat)?.boundsPeriod
    let sr2StartDate = sr2BoundsPeriod?.start !== undefined ? new Date(sr2BoundsPeriod.start) : undefined

    if (sr1StartDate === undefined && sr2StartDate !== undefined) {
      return 1
    }
    if (sr1StartDate !== undefined && sr2StartDate === undefined) {
      return -1
    }
    if (sr1StartDate! < sr2StartDate!) {
      return 1;
    }
    if (sr1StartDate! > sr2StartDate!) {
      return -1;
    }
    return 0;
  })

  return (
    <div className="home-view">
      <div className="welcome">

        <h4 className="title">Planned Activities (Interventions)</h4>

        {serviceRequests === undefined || serviceRequests?.length < 1
          ? <p>No records found.</p>
          :
          <>
            {serviceRequests?.map((service, idx) => (
              <Summary key={idx} id={idx} rows={buildRows(service)} />
            ))}
          </>
        }

      </div>
    </div>
  )

}

const buildRows = (service: ServiceRequest): SummaryRowItems => {
  let rows: SummaryRowItems =
    [
      {
        isHeader: true,
        twoColumns: false,
        data1: displayConcept(service.code) ?? "No description",
        data2: '',
      },
      {
        isHeader: false,
        twoColumns: false,
        data1: service.requester === undefined ? ''
          : 'Requested by: ' + service.requester?.display,
        data2: '',
      },
      {
        isHeader: false,
        twoColumns: false,
        data1: service.occurrenceTiming === undefined ? ''
          : 'Scheduled on ' + displayTiming(service.occurrenceTiming),
        data2: '',
      },
      {
        isHeader: false,
        twoColumns: false,
        data1: service.reasonCode === undefined ? ''
          : 'Reason: ' + displayConcept(service.reasonCode?.[0]),
        data2: '',
      },
      /*May need to be implemented one day...
        {(service.authoredOn === undefined) ? '' :
        <tr><td>Authored on: {displayDate(service.authoredOn)}</td></tr>}*/
    ]

  const notes: SummaryRowItems | undefined = service.note?.map((note) => (
    {
      isHeader: false,
      twoColumns: false,
      data1: note.text ? 'Note: ' + note.text : '',
      data2: '',
    }
  ))
  if (notes?.length) {
    rows = rows.concat(notes)
  }

  return rows
}