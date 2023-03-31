import './Home.css';
import React from 'react';
import { Link } from "react-router-dom";
import { FHIRData } from './data-services/models/fhirResources';
import { PatientSummary, ScreeningSummary } from './data-services/models/cqlSummary';
// import { Task } from './data-services/fhir-types/fhir-r4';
import { BusySpinner } from './components/busy-spinner/BusySpinner';
// import BusyGroup from './components/busy-spinner/BusyGroup';

interface HomeProps {
  fhirData?: FHIRData,
  patientSummary?: PatientSummary,
  screenings?: [ScreeningSummary],
  // tasks?: [Task] | undefined
}

interface HomeState {

}

export default class Home extends React.Component<HomeProps, HomeState> {

  constructor(props: HomeProps) {
    super(props);
    this.state = {
    };
  }

  public render(): JSX.Element {
    let fhirData = this.props.fhirData
    let patient = this.props.patientSummary;
    let screenings = this.props.screenings?.filter(s => s.notifyPatient);
    // let tasks = this.props.tasks;

    return (
      <div className="home-view">
        <div className="welcome">
          <h4 className="title" style={{ textAlign: 'center' }}>Welcome to My Care Planner!</h4>
          <p>My Care Planner is a tool to help you and your care team work together to keep you healthy. It is a completely personalized way to see what steps you’ve already taken and what else you can do to check for and prevent illnesses.</p>

          {(fhirData?.caregiverName === undefined) ? '' :
            <p className="subheadline">Caregiver <b>{fhirData?.caregiverName}</b></p>
          }
          {(patient === undefined) ? '' :
            <p className="subheadline">
              {(fhirData?.caregiverName === undefined) ? '' : 'for '}
              {/* <b>{patient?.fullName}</b> ({patient?.gender}) Age {patient?.age} */}
              <b>{patient?.fullName}</b> (age {patient?.age})
            </p>
          }
        </div>
        {(this.props.fhirData === undefined)
          ? <div className="welcome">
            {process.env.REACT_APP_SHOW_LINK_TO_PROVIDER_LOGIN_ON_LAUNCH === 'true' &&
              <>
                {/* DEV TEST: Adds option to navigate to retrieve records on launch or during load */}
                <Link to={{
                  pathname: '/provider-login',
                  state: {
                    fhirData: this.props.fhirData
                  }
                }}>Retrieve records from other healthcare providers</Link>
                <br />
              </>
            }
            <p>Reading your clinical records...</p>
            <BusySpinner busy={this.props.fhirData === undefined} />
          </div>
          : <div>

            <h5 style={{ marginTop: '20px' }}>My Tasks</h5>

            <Link to={{
              pathname: '/questionnaire',
              state: { patientSummary: this.props.patientSummary, questionnaireId: 'PROMIS-29-questionnaire' }
            }} ><strong>General Health Assessment</strong></Link><br />
            <Link to={{
              pathname: '/questionnaire',
              state: { patientSummary: this.props.patientSummary, questionnaireId: 'PRAPARE-questionnaire' }
            }} ><strong>Social Support Assessment</strong></Link><br />
            <Link to={{
              pathname: '/questionnaire',
              state: { patientSummary: this.props.patientSummary, questionnaireId: 'caregiver-strain-questionnaire' }
            }} ><strong>Caregiver Strain Assessment</strong></Link><br />
            {/* <Link to={{pathname: '/questionnaire',
                      state: { patientSummary: this.props.patientSummary, questionnaireId: 'mypain-questionnaire' }
                    }} ><strong>My Pain Assessment</strong></Link><br/> */}

            <p />

            {/* {(tasks === undefined)
                ? <p>You have no tasks today!</p>
                : <ul>
                    {tasks?.map((task, idx) => (
                    <li key={idx.toString()}><Link to={{
                            pathname: '/task',
                            state: { patientSummary: this.props.patientSummary, task: task }
                        }}>{task.description}</Link>
                    </li>))}
                </ul>
            } */}

            <h5 style={{ paddingTop: '20px' }}>Preventive Care</h5>
            {(screenings !== undefined && screenings.length === 0)
              ? <p>You have no screenings due.</p>
              : <ul>
                {screenings?.map((s, idx) => (
                  <li key={idx.toString()}><Link to={{
                    pathname: '/decision',
                    state: { patientSummary: this.props.patientSummary, screening: s }
                  }}>{s.name}</Link>
                    <ul><li>{s.title}</li></ul>
                  </li>))}
              </ul>
            }

            <h5 style={{ paddingTop: '20px' }}>Shared Health Records</h5>
            <Link to={{
              pathname: '/provider-login',
              state: {
                fhirData: this.props.fhirData
              }
            }}>Retrieve records from other healthcare providers</Link>
            <br /><Link to={{ pathname: '/share-data' }}>Share your health data</Link>
            <br /><Link to={{ pathname: '/shared-data-summary' }}>Summary of shared health data</Link>
          </div>
        }
      </div>
    );
  }


}
