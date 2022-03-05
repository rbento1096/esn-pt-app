import { useState } from 'react';
import { IonContent, IonPage, useIonToast, useIonViewWillEnter, useIonLoading, IonButton, IonAlert } from '@ionic/react';
import { getUserProfile } from '../utils/data';
import Auth from '@aws-amplify/auth';

import { Organization } from 'models/organization';
import { toastMessageDefaults } from '../utils';
import { getOrganization, getURLPathResourceId } from '../utils/data';

import OrganizationCard from '../components/OrganizationCard';
import EntityHeader from '../components/EntityHeader';

const OrganizationPage: React.FC = () => {
  const [showMessage] = useIonToast();
  const [showLoading, dismissLoading] = useIonLoading();
  const [showAlert, setShowAlert] = useState(false);

  const [organization, setOrganization] = useState<Organization>();

  useIonViewWillEnter(() => {
    loadData();
  }, []);
  const loadData = async (): Promise<void> => {
    try {
      const organizationId = getURLPathResourceId();
      const organization = await getOrganization(organizationId);
      setOrganization(organization);
    } catch (err) {
      await showMessage({ ...toastMessageDefaults, message: 'Organization not found.' });
    }
  };

  const submitContactInfo = async (event: any): Promise<void> => {
    // add loading
    // add toast messages
    event.preventDefault();

    if (!organization) return;

    const userProfile = await getUserProfile();

    if (!userProfile) return;

    if (!userProfile.contactEmail) {
      const user = await Auth.currentAuthenticatedUser();
      userProfile.contactEmail = user.attributes.email;
    }

    const { firstName, lastName, contactEmail, contactPhone, hasUploadedCV } = userProfile;

    // at confirmation an email will be sent to contactEmail

  }

  return (
    <IonPage>
      <EntityHeader
        title="Organization details"
        type="organization"
        id={organization?.organizationId || ''}
      ></EntityHeader>
      <IonContent>
        <div className="cardContainer">
          <OrganizationCard organization={organization}></OrganizationCard>
        </div>
        <IonButton onClick={() => setShowAlert(true)} expand="block">I'd like to get in contact</IonButton>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass='my-custom-class'
          header={'Choose info to send'}
          inputs={[
            {
              name: 'Name',
              type: 'checkbox',
              label: 'Name',
              checked: true,
              disabled: true
            },
            {
              name: 'Email',
              type: 'checkbox',
              label: 'Email',
              checked: true,
              disabled: true
            },
            {
              name: 'Phone Nr.',
              type: 'checkbox',
              label: 'Phone Nr.',
              handler: () => {
                console.log('Phone Nr. selected');
              }
            },
            {
              name: 'CV',
              type: 'checkbox',
              label: 'CV',
              handler: () => {
                console.log('CV selected');
              }
            }
          ]}
          buttons={[
            {
              text: 'Cancel',
              handler: () => {
                // return true to close the alert (is it needed?)
                return true;
              },
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: 'Submit',
              handler: (inputData) => {
                // change to the appropriate handler
                alert('submit button pressed');
                // just to check if the checkboxes are passed this way
                console.log(inputData);
                // return true to close the alert (is it needed?)
                return true;
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default OrganizationPage;
