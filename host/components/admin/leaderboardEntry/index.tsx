
import React, { FC, useEffect, useState } from 'react';
import { Alert, Button, Card, DatePicker, Form, Input, TimePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

import { TimeEntry } from 'types';
import { trim } from 'lodash';

type FormData = {
  apiKey: string;
  date: moment.Moment;
  entries: {
    time: moment.Moment;
    username: string;
  }[];
}

const fetchBatchCreate = async (apiKey: string, entries: TimeEntry[]) => {
  try {
    // we do not store the response because we are using no-cors, which makes
    // the response "opaque" and unreadable, instead we just record that the 
    // request was sent, not any result from the request
    const resp = await fetch(
      `/api/batchCreate?k=${apiKey}`,
      {
        method: 'POST',
        body: JSON.stringify({ entries }),
      }
    );
    const data = await resp.json();
    return data;
  } catch (e) {
    return {
      errorMessage: 'Unable to update entries'
    }
  }
}

const userEntriesBulletPoint = (actionTitle: string, entries: TimeEntry[]) => {
  const entriesString = (entries.length === 0) ? 'None' : entries.map(e => e.username).join(',');
  return `${actionTitle}: ${entriesString}`
}

const LeaderboardEntryComponent: FC = () => {

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState(null);
  const [form] = Form.useForm();

  // useEffect(() => {
  //   setTimeout(() => {
  //     setSuccessMessage(null);
  //   }, 8000);
  // }, [successMessage]);

  const renderSuccessMessage = () => {
    return (
      <>
        <p>{`Admin update for ${successData.date.format('YYYY-MM-DD')}`}</p>
        <ul>
          <li>{userEntriesBulletPoint('Created entries', successData.newEntries)}</li>
          <li>{userEntriesBulletPoint('Updated entries', successData.updateEntries)}</li>
          <li>{userEntriesBulletPoint('Deleted entries', successData.deleteEntries)}</li>
        </ul>
      </>
    );
  }

  const onFinish = (values: FormData) => {
    setErrorMessage(null);
    const entries = values.entries.map(e => {
      return {
        time: e.time.minutes() * 60 + e.time.seconds(),
        username: trim(e.username),
        date: values.date.format('YYYY-MM-DD')
      }
    });
    // fetch the batchCreate endpoint with the values
    fetchBatchCreate(values.apiKey, entries).then((data) => {
      // if there is an error message, then post that
      if (data.errorMessage && data.errorMessage !== '') {
        setErrorMessage(data.errorMessage);
        return;
      }
      // on success, unset all the leaderboard entries and show success message
      setSuccessData({
        date: values.date,
        ...data
      });
      form.resetFields(['entries'])
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    setErrorMessage(null);
    console.error('Failed:', errorInfo);
  };

  return (
    <Card title="Manually Enter Leaderboard">

      <p>This form can be used to enter, update, and delete times on any day.</p>
      <ul>
        <li>The API Key is required to update the leaderboard</li>
        <li>Only enter leaderboard times for one date per submission</li>
        <li>Usernames are case sensitive</li>
        <li>Entering a time of 0 will delete an entry</li>
      </ul>
      <p>{`Use this carefully and please don't cheat`}</p>

      <Form
        form={form}
        name="manual_leaderboard_entry"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >

        {/* API Key */}
        <Form.Item
          label="API Key"
          name="apiKey"
          rules={[{ required: true, message: 'API Key required' }]}
        >
          <Input type="password" />
        </Form.Item>

        {/* Date */}
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Date required' }]}
        >
          <DatePicker />
        </Form.Item>

        {/* Usernames */}
        <Form.List
          name="entries"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length === 0) {
                  return Promise.reject(new Error('At least one entry is required'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Form.Item
                  key={key}
                  wrapperCol={{ offset: index === 0 ? 0 : 4, span: 20 }}
                  label={index === 0 ? 'Leaderboard' : ''}
                  style={{ marginBottom: 0 }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'username']}
                    rules={[{ required: true, message: 'Missing username' }]}
                    style={{ display: 'inline-block', width: 'calc(50% - 16px)' }}
                  >
                    <Input placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'time']}
                    rules={[{ required: true, message: 'Missing time' }]}
                    style={{ display: 'inline-block', width: 'calc(50% - 16px)', margin: '0 8px' }}
                  >
                    <TimePicker format="mm:ss" />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ margin: '9px 0' }}
                  />
                </Form.Item>
              ))}
              <Form.Item
                wrapperCol={{ offset: fields.length === 0 ? 0 : 4, span: 20 }}
                label={fields.length === 0 ? 'Leaderboard' : ''}
              >
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ width: `calc(100% - 24px)` }}
                >
                  Add entry
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Submit */}
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {
        errorMessage && <Alert
          message="Error"
          description={errorMessage}
          type="error"
          closable
          style={{ maxWidth: '480px' }}
          onClose={() => setErrorMessage(null)}
        />
      }
      {
        successData && <Alert
          message="Success"
          description={renderSuccessMessage()}
          type="success"
          closable
          style={{ maxWidth: '480px' }}
          onClose={() => setSuccessData(null)}
        />
      }
    </Card>
  );
}

export { LeaderboardEntryComponent }