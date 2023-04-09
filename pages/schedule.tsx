import { useState } from 'react'
import { Layout, Row, Col, Avatar, Button, List, Input, DatePicker, Select } from 'antd'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment, { Moment } from 'moment'
import Header from '@/components/header'
import Contacts from '@/components/contacts'
import styles from '@/styles/Home.module.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const { Content } = Layout
const { Option } = Select
const localizer = momentLocalizer(moment)

type Contact = {
  name: string
  email: string
}

type Event = {
  title: string
  start: Date
  end: Date
  participants: string[]
}

function SchedulePage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContact, setNewContact] = useState<string>('')
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<Event>({ title: '', start: new Date(), end: new Date() })

  const handleAddContact = () => {
    if (newContact) {
      setContacts([...contacts, { name: newContact, email: '' }])
      setNewContact('')
    }
  }

  interface Event {
    title: string
    start: Date
    end: Date
    participants?: string[]
  }

  const handleAddEvent = (value: Moment[]) => {
    if (newEvent.title && value.length === 2) {
      setEvents([
        ...events,
        {
          ...newEvent,
          start: value[0].toDate(),
          end: value[1].toDate(),
          participants: newEvent.participants || []
        }
      ])
      setNewEvent({ title: '', start: new Date(), end: new Date() })
    }
  }

  return (
    <Layout>
      <Header></Header>
      <Content style={{ padding: '50px' }}>
        <Row gutter={24}>
          <Col span={6} className={styles.schedule_left}>
            <Contacts />
            <div>
              <h2>会面安排</h2>
              <List
                dataSource={events}
                renderItem={event => (
                  <List.Item>
                    <List.Item.Meta
                      title={moment(event.start).format('YYYY-MM-DD HH:mm')}
                      description={`参与人：${event?.participants && event?.participants.join(', ')}`}
                    />
                    <div>{event.title}</div>
                  </List.Item>
                )}
              />
              <Input
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="会议标题"
                style={{ marginBottom: '10px' }}
              />
              <Select
                mode="multiple"
                value={newEvent.participants}
                onChange={value => setNewEvent({ ...newEvent, participants: value })}
                placeholder="参与人员"
                style={{ width: '100%', marginBottom: '10px' }}
              >
                {contacts.map(contact => (
                  <Select.Option key={contact.email} value={contact.name}>
                    {contact.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={16} style={{ color: '#000' }}>
            <Calendar
              localizer={localizer}
              events={events}
              views={[Views.MONTH]}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 'calc(100vh - 120px)' }}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default SchedulePage
