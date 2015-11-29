package shipit_plugin;

import java.util.concurrent.CopyOnWriteArrayList;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import javax.naming.NamingException;

public class QReceiver extends QCommon implements MessageListener
{
    private MessageConsumer receiver;
    CopyOnWriteArrayList<String>            requests = null;

    public QReceiver(CopyOnWriteArrayList<String> requests)
    {
        this.requests = requests;
    }

    public void onMessage(Message message)
    {
        String msgText = null;
        try
        {
            msgText = ((TextMessage) message).getText();
        }
        catch (Throwable e)
        {
            e.printStackTrace();
            msgText = e.getMessage();
        }
        finally
        {
            requests.add(msgText);
        }
    }

    public void setQueue(String queueName) throws JMSException,
        NamingException, Throwable
    {
        try
        {
            if (connection != null)
            {
                connection.stop();
            }
            if (receiver != null)
            {
                receiver.close();
            }

            Destination queue = (Destination) getInitContext().lookup(queueName);
            receiver = session.createConsumer(queue);
            receiver.setMessageListener(this);
            connection.start();

        }
        catch (Throwable e)
        {
            e.printStackTrace();
            throw e;
        }
    }

    public void close() throws JMSException, NamingException, Throwable
    {
        try
        {
            if (receiver != null)
            {
                receiver.close();
            }
            super.close();
        }
        catch (Throwable e)
        {
            e.printStackTrace();
            throw e;
        }
    }
}
