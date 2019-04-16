import glob
import os
import slate3k as slate
import sys
from pymongo import MongoClient


BigDataTools = ['AgoraPulse',
     'Keyhole',
     'Buffer',
     'Brandwatch',
     'BuzzSumo',
     'Edgar',
     'Analytics',
     'Hootsuite',
     'Klout',
     'Little Bird',
     'NetBase',
     'Oktopost',
     'Quintly',
     'Rival IQ',
     'Salesforce Marketing Cloud',
     'Simply Measured',
     'Socialbakers',
     'Social Mention',
     'Followerwonk',
     'Iconosquare',
     'SocialBro',
     'Tailwind',
     'TweetReach',
     'IBM',
     'HP ',
     'SAP',
     'Microsoft',
     'Oracle',
     'Talend',
     'Teradata',
     'SAS',
     'Dell ',
     'HPCC',
     'Palantir',
     'Pivotal',
     'BigQuery',
     'Pentaho',
     'Amazon',
     'AWS',
     'Cloudera',
     'Hortonworks',
     'FICO',
     'Cisco',
     'Splunk',
     'Intel',
     'Mu',
     'sigma',
     'Opera',
     'Informatica',
     'MarkLogic',
     'Vmware',
     'Syncsort',
     'MongoDB',
     'Guavus',
     'Alteryx',
     '1010data',
     'Actian',
     'MapR',
     'Tableau',
     'QlikView',
     'Attivio’s',
     'DataStax',
     'Gooddata',
     'machine',
     'learning',
     'Datameer',
     'Amdocs',
     'Cisco',
     'Platfora',
     'GE',
     'MapReduce',
     'GridGain',
     'HPCC',
     'Storm',
     'Hadoop',
     'Cassandra',
     'HBase',
     'Neo4j',
     'CouchDB',
     'OrientDB',
     'Terrastore',
     'FlockDB',
     'Hibari',
     'Riak',
     'Hypertable',
     'Blazegraph',
     'Hive',
     'InfoBright',
     'Infinispan',
     'Redis',
     'Jaspersoft',
     'Jedox',
     'Pentaho',
     'SpagoBI',
     'KNIME',
     'BIRT',
     'RapidMiner',
     'Mahout',
     'Orange',
     'Weka',
     'DataMelt',
     'KEEL',
     'SPMF',
     'Rattle',
     'Gluster',
     'Hadoop',
     'HDFS',
     'Pig',
     'R',
     'ECL',
     'Lucene',
     'Solr',
     'Sqoop',
     'Flume',
     'Chukwa',
     'Terracotta',
     'Avro',
     'Oozie',
     'kafka',
     'Zookeeper',
     'Ambari',
     'Avro',
     'Cascading',
     'Chukwa',
     'Flume',
     'HBase',
     'Hive',
     'Hivemall',
     'Mahout',
     'MapReduce',
     'Oozie',
     'Pig',
     'Sqoop',
     'Spark',
     'Tez',
     'YARN',
     'Zookeeper',
     'Disco',
     'HPCC',
     'Lumify',
     'Pandas',
     'Storm',
     'Blazegraph',
     'Cassandra',
     'CouchDB',
     'FlockDB',
     'Hibari',
     'Hypertable',
     'Impala',
     'MongoDB',
     'Greenplum',
     'Neo4j',
     'OrientDB',
     'Pivotal',
     'Riak',
     'Redis',
     'GitHub',
     'SQLite',
     'talend',
     'Jaspersoft',
     'Pentaho',
     'SpagoBI',
     'KNIME',
     'BIRT',
     'DataMelt',
     'jHepWork',
     'KEEL',
     'Orange',
     'RapidMiner',
     'Rattle',
     'SPMF',
     'Weka',
     'Drill',
     'R',
     'ECL',
     'Lucene',
     'Solr',
     'Ignite',
     'Terracotta',
     'Pivotal GemFire',
     'Geode',
     'GridGain',
     'Infinispan']
BigDataTools = list(set(BigDataTools))
BigDataTools = [BigDataTools[i].lower() for i in range(len(BigDataTools))]

Program = ['APL',
 'AutoIt',    
 'html',
 'jee',
 'css',
 'js',
 'javascript',
 'BASIC',
 'Eiffel',
 'Forth',
 'Frink',
 'ICI',
 'J',
 'Lisp',
 'Lua',
 'M',
 'Pascal',
 'PCASTL',
 'Perl',
 'PostScript',
 'Python',
 'REXX',
 'Ruby',
 'S-Lang',
 'Spin',
 'Charity',
 'Clean',
 'Curry',
 'Erlang',
 'F#',
 'Haskell',
 'Joy',
 'Kite',
 'ML',
 'Nemerle',
 'OPAL',
 'OPS5',
 'Q',
 'Ada',
 'ALGOL',
 'C',
 'C++',
 'C#',
 'CLEO',
 'COBOL',
 'Cobra',
 'D',
 'DASL',
 'DIBOL',
 'Fortran',
 'Java',
 'JOVIAL',
 'Objective-C',
 'Objective',
 'SMALL',
 'Smalltalk',
 'Turing',
 'Visual',
 'Basic',
 'vb',
 'vba',
 'Visual FoxPro',
 'XL',
 'Bliss',
 'ChucK',
 'CLIST',
 'HyperTalk',
 'Modula-2',
 'Oberon',
 'Component Pascal',
 'MATLAB',
 'plsql',
 'Occam',
 'PL',
 'PL/I',
 'Rapira',
 'RPG',
 'AppleScript',
 'Awk',
 'BeanShell',
 'ColdFusion',
 'F-Script',
 'JASS',
 'Maya',
 'Mondrian',
 'PHP',
 'Revolution',
 'Tcl',
 'VBScript',
 'Windows PowerShell',
 'Curl',
 'SGML',
 'HTML',
 'XML',
 'XHTML',
 'ALF',
 'Fril',
 'Janus',
 'Leda',
 'Oz',
 'Poplog',
 'Prolog',
 'ROOP',
 'ABCL',
 'Afnix',
 'Cilk',
 'Concurrent',
 'Pascal',
 'E',
 'Joule',
 'Limbo',
 'Pict',
 'SALSA',
 'SR',
 'Agora',
 'BETA',
 'Cecil',
 'Lava',
 'Lisaac',
 'MOO',
 'eclipse',
 'Moto',
 'Object-Z',
 'Obliq',
 'Oxygene',
 'Pliant',
 'Prograph',
 'REBOL',
 'Scala',
 'Self',
 'Slate',
 'XOTcl',
 'IO']
Program = [Program[i].lower() for i in range(len(Program))]


Framework = ['Reactive',
'MobX',
'Omniscient',
'Ractive.js',
'Mercury',
'WebRx',
'Deku',
'Riot.js',
'Mithril',
'Vue.js',
'MVC JavaScript Frameworks',
'Angular.js',
'angular',
'jQuery',
'React',
'hibernate',
'bootstrap',
'Socket',
'Polymer',
'Node.js',
'node',
'nodejs',
'Meteor',
'D3.js',
'Ember',
'Aurelia',
'Knockout',
'Keystone',
'Backbone',
'Stapes']

Mobile = ['Swift',
 'PhoneGap',
 'Appcelerator',
 'RhoMobile',
 'WidgetPad',
 'MoSync',
 'Flutter',
 'react',
 'Native',
 'Ionic ',
 'Xamarin']
Mobile = [Mobile[i].lower() for i in range(len(Mobile))]

Design = ['Photoshop',
 'Illustrator',
 'Studio'
 'After',
 'Effects',
 'Lightroom',
 'InDesign',
 'Muse',
 'CC',
 'Flash',
 '3D',
 'Max',
 'Cinema',
 '4D',
 'Corel',
 'Draw',
 'FontLab',
 'Kelk',
 'QuarkXPress',
 'Axure',
 'RP',
 'Sketch',
 'Glyphs',
 'Zeplin',
 'Square',
 'Space',
 'Webflow',
 'Figma',
 'Wacom',
 'InVision',
 'GravitDesigner',
 'Flinto']
Design = [Design[i].lower() for i in range(len(Design))]


# In[14]:


Scrum = ['Agilean',
 'Wrike',
 'Trello',
 'Apiumhub',
 'JIRA',
 'Axosoft',
 'Planbox',
 'Assembla',
 'Pivotal',
 'Asana',
 'Binfire',
 'Drag',
 'Drag Team',
 'here',
 'Proggio',
 'nTask',
 'OneDesk',
 'VivifyScrum',
 'StoriesOnBoard',
 'Nuvro']
Scrum = [Scrum[i].lower() for i in range(len(Scrum))]


DevOps = ['jenkins',
    'solarwinds',
    'vagrant',
    'pagerduty',
    'prometheus',
    'ganglia',
    'snort',
    'splunk',
    'nagios',
    'chef',
    'sumo'
    'logic',
    'rabbitmq',
    'logstash',
    'loggly',
    'devops',
    'activemq',
    'papertrail',
    'overops',
    'squid',
    'visual'
    'ide',
    'mcollective',
    'memcached',
    'docker',
    'cacti',
    'cfengine',
    'gradle',
    'maven',
    'jfrog',
    'artifactory',
    'capistrano',
    'redis',
    'tripwire',
    'monit',
    'collectl',
    'consul',
    'jira',
    'ant',
    'god',
    'productionmap',
    'juju',
    'scalyr',
    'saltstack',
    'ansible',
    'code-climate',
    'rudder',
    'puppet',
    'graylog',
    'upguard',
    'sensu']
DevOps = [DevOps[i].lower() for i in range(len(DevOps))]


BI = ['informatica',
    'infosphere',
    'infosphere',
    'integrator',
    'server',
    'ab initio',
    'talend',
    'sql',
    'cloveretl',
    'pentaho',
    'nifi',
    'jasper',
    'sas',
    'sap',
    'warehouse',
    'sybase',
    'etl',
    'dbsoftlab',
    'sisense',
    'birt',
    'iccube',
    'domo',
    'board',
    'clear',
    'ducen',
    'gooddata',
    'cognos',
    'insightsquared',
    'jaspersoft',
    'looker',
    'microstrategy',
    'mits',
    'openi',
    'oracle bi ',
    'oracle enterprise bi server',
    'oracle hyperion system',
    'palo',
    'olap',
    'pentaho',
    'power',
    'bi',
    'profit base',
    'qlikview',
    'rapid-insight',
    'rapid',
    'insight',
    'sap business intelligence',
    'sap businessobjects ',
    'sap netweaver bw',
    'sas bi',
    'silvon',
    'solver',
    'spagobi',
    'style intelligence',
    'syntell',
    'targit',
    'vismatica',
    'webfocus',
    'yellowfin']
BI = list(set(BI))
BI = [BI[i].lower() for i in range(len(BI))]


BD = ['Informix',
     'SQLite',
     'PostgreSQL',
     'RDS',
     'MongoDB',
     'Redis',
     'CouchDB',
      'mysql',
      'json',
     'Neo4j',
     'OrientDB',
     'Couchbase',
     'Toad',
     'phpMyAdmin',
     'SQL-Developer',
     'Sequel',
     'Robomongo',
     'DbVisualizer',
     'Cloudera',
     'MariaDB',
     'Informix',
     '4D']
BD = [BD[i].lower() for i in range(len(BD))]


Profile = ['data',
    'sharepoint',
    'mobile',
    'ios',
    'android',
    'développement',
    'ux',
    'ui',
    'designer',
    'intégrateur',
    'front',
    'frontend',
    'back end',
    'back',
    'fullstack',
    'full-stack',
    'scrum master',
    'lead tech',
    'owner',
    'manager',
    'architect',
    'bi',
    'etl',
    'expert',
    'devops',
    'hybride',
    'testeur',
    'recette',
    'recetteur']

Metiers = ['cash',
         'payment',
         'bfi',
         'cib',
         'risk',
         'assurance',
         'banque',
         'détails',
         'finance',
         'marché']

for filepath in glob.iglob('../public/uploads/*.pdf'):

    with open(filepath,'rb') as f:
        text = slate.PDF(f)
        name = os.path.basename(f.name)
        pdfid = name.split(".")[0]  
    t = ' '.join(text)
    txt = t.replace('\n', ' ').replace('\t', ' ').replace(',', ' ').replace(':', ' ').replace('/', ' ').replace('(', ' ').replace(')', ' ').replace('-', ' ').lower()
    L = txt.split(" ")     
    txt = txt.encode('utf8')
    def intersection(lst1, lst2): 
        lst3 = [value for value in lst1 if value in lst2] 
        return list(set(lst3))  

    Prog = intersection(L,Program)
    BigData = intersection(L,BigDataTools)
    Frame = intersection(L,Framework)
    MobileDev = intersection(L,Mobile)
    DevOpsTools = intersection(L,DevOps)
    DesignTools = intersection(L,Design)
    ScrumTools = intersection(L,Scrum)
    BusinessIntelligence = intersection(L,BI)
    DataBase = intersection(L,BD)
    ProfileType = intersection(L,Profile)
    MetiersType = intersection(L,Metiers)

    Result = {'Developpement' : Prog,
              'Framework': Frame,
             'Big Data' : BigData,
              'Mobile' : MobileDev,
              'DevOps' : DevOpsTools,
              'Design': DesignTools,
              'Scrum' : ScrumTools,
              'BI': BusinessIntelligence,
              'BD': DataBase,
              'Profile' : ProfileType
             }
    L = list(set(L))

    Tools = Prog + Frame + BigData + MobileDev + DevOpsTools + DesignTools + ScrumTools + BusinessIntelligence + DataBase
    Technologies = ProfileType

    Client = MongoClient("mongodb://datauser:0p3nLAB@ds145303.mlab.com:45303/maltem_cv")
    db = Client["maltem_cv"]
    col = db["pdfparser"]

    document = {
        "id" : pdfid,
        "texte": txt,
        "tools": Tools,
        "technologies": Technologies
    }
    x = col.insert_one(document)


    #print('Deplacement du CV au nouveau dossier')
    #print(filepath)
    print(pdfid, txt, Tools, Technologies)
    sys.stdout.flush()

    finished_data = '../public/attachements/' + pdfid + '.pdf'
    #print('Moving converted data file... to attachements')
    os.rename(filepath, finished_data)