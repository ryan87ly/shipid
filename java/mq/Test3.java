package shipit_plugin;

import java.util.Properties;
import javax.jms.Connection;
import javax.jms.JMSException;
import javax.jms.QueueConnectionFactory;
import javax.jms.Session;
import javax.jms.TopicConnection;
import javax.jms.TopicConnectionFactory;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

public class Test3
{
    public static void main(String[] args)
    {
        Connection qconn = null;
        Connection tconn = null;
        Session session = null;
        
        Properties env = new Properties();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.ibm.websphere.naming.WsnInitialContextFactory");
        env.put(Context.PROVIDER_URL, "iiop://localhost:2809");
        try
        {
            Context context = new InitialContext(env);
            TopicConnectionFactory topicCF = (TopicConnectionFactory) context.lookup("jms/topicconnf");
            tconn = topicCF.createConnection();
            
//            QueueConnectionFactory queueCF = (QueueConnectionFactory) context.lookup("jms/mqconnf");
//            qconn = queueCF.createConnection();
//            session = qconn.createSession(false, javax.jms.Session.AUTO_ACKNOWLEDGE);
            
            System.out.println("done");
        }
        catch (NamingException e)
        {
            e.printStackTrace();
        }
        catch (JMSException e)
        {
//            e.getLinkedException().printStackTrace();
            e.printStackTrace();
        }finally{
            try
            {
                qconn.close();
                tconn.close();
                session.close();
            }
            catch (JMSException e)
            {
                e.printStackTrace();
            }
        }
    }
}
