'use client';
import Breadcrumb from 'components/Dashboard/Breadcrumbs/Breadcrumb';
import DefaultLayout from 'components/Dashboard/DefaultLayout';
import Modal from 'components/ui/modal';
import Table from 'components/ui/table';
import React, { useState } from 'react';
import { FaRegEye } from 'react-icons/fa';
import { IAppointment } from 'types/types';

const Measurement = ({
  appointments,
  title
}: {
  appointments: IAppointment[];
  title: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.preferredDate).getTime();
    const dateB = new Date(b.preferredDate).getTime();
    return dateB - dateA;
  });
  const showModal = (record: IAppointment) => {
    setSelectedAppointment(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const columns = [
    {
      title: 'Name',
      key: 'firstname'
    },
    {
      title: 'Email',
      key: 'email'
    },
    {
      title: 'Phone Number',
      key: 'phoneNumber'
    },
    {
      title: 'Area',
      key: 'area'
    },
    {
      title: 'Approximate Area',
      key: 'selectRooms'
    },
    {
      title: 'Preferred Time',
      key: 'preferredTime'
    },
    {
      title: 'Preferred Date',
      key: 'preferredDate',
      render: (record: IAppointment) =>
        new Date(record.preferredDate).toLocaleDateString()
    },
    {
      title: 'View',
      key: 'view',
      render: (record: IAppointment) => (
        <button onClick={() => showModal(record)}>
          <FaRegEye />
        </button>
      )
    }
  ];
  return (
    <DefaultLayout>
      <Breadcrumb pageName={title} />
      {appointments && appointments.length > 0 ? (
        <>
          <Table<IAppointment>
            data={sortedAppointments}
            columns={columns}
            rowKey="id"
          />
          <Modal
            isOpen={isModalOpen}
            onClose={handleCancel}
            onCancel={handleCancel}
          >
            {selectedAppointment && (
              <div className="space-y-3">
                <p>
                  <strong>Name:</strong> {selectedAppointment.firstname}
                </p>
                <p>
                  <strong>Email:</strong> {selectedAppointment.email}
                </p>
                <p>
                  <strong>Phone Number:</strong>{' '}
                  {selectedAppointment.phoneNumber}
                </p>
                <p>
                  <strong>WhatsApp Number:</strong>{' '}
                  {selectedAppointment.whatsappNumber || '-'}
                </p>
                <p>
                  <strong>Area:</strong> {selectedAppointment.area || '-'}
                </p>
                <p>
                  <strong>Rooms:</strong>{' '}
                  {selectedAppointment.selectRooms || '-'}
                </p>
                <p>
                  <strong>Preferred Time:</strong>{' '}
                  {selectedAppointment.preferredTime || '-'}
                </p>
                <p>
                  <strong>Preferred Date:</strong>{' '}
                  {selectedAppointment.preferredDate
                    ? new Date(
                        selectedAppointment.preferredDate
                      ).toLocaleDateString()
                    : '-'}
                </p>
                <p>
                  <strong>Find Us:</strong> {selectedAppointment.findUs || '-'}
                </p>
                <p>
                  <strong>Comment:</strong> {selectedAppointment.comment || '-'}
                </p>
                <p>
                  <strong>Contact Method:</strong>{' '}
                  {selectedAppointment.contactMethod
                    ? Object.entries(selectedAppointment.contactMethod)
                        .filter(([value]) => value)
                        .map(
                          ([key]) => key.charAt(0).toUpperCase() + key.slice(1)
                        )
                        .join(', ')
                    : '-'}
                </p>
              </div>
            )}
          </Modal>
        </>
      ) : (
        <p className="text-primary dark:text-white">No products found</p>
      )}
    </DefaultLayout>
  );
};

export default Measurement;
