package shipit_plugin;

import java.util.Properties;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.JMSException;
import javax.jms.Session;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

public class QCommon
{
    protected InitialContext initContext;
    protected Connection     connection;
    protected Session        session;

    protected InitialContext getInitContext() throws NamingException
    {
        Properties env = new Properties();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.ibm.websphere.naming.WsnInitialContextFactory");
        env.put(Context.PROVIDER_URL, "iiop://localhost:2809");

        if (initContext == null)
        {
            initContext = new InitialContext(env);
        }
        return initContext;
    }

    public void setConnection(String connectionName) throws JMSException,
        NamingException, Throwable
    {
        try
        {
            close();
            ConnectionFactory factory = (ConnectionFactory) getInitContext()
                .lookup(connectionName);
            connection = factory.createConnection();
            session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
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
            if (connection != null)
                connection.stop();
            if (session != null)
                session.close();
            if (connection != null)
                connection.close();
        }
        catch (Throwable e)
        {
            e.printStackTrace();
            throw e;
        }
    }

    public void closeDown() throws JMSException, NamingException, Throwable
    {
        close();
        if (initContext != null)
            try
            {
                initContext.close();
            }
            catch (NamingException e)
            {
                e.printStackTrace();
                throw e;
            }
    }
}
