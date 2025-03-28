PGDMP              	        }            postgres    17.2    17.2 1    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    5    postgres    DATABASE     �   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.utf8';
    DROP DATABASE postgres;
                     postgres    false            �           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                        postgres    false    4850            �            1259    20520    auctions    TABLE     �  CREATE TABLE public.auctions (
    id integer NOT NULL,
    desctription text,
    end_time timestamp with time zone DEFAULT (now() + '24:00:00'::interval) NOT NULL,
    starting_price numeric(10,2) NOT NULL,
    current_price numeric(10,2) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer,
    item_id integer
);
    DROP TABLE public.auctions;
       public         heap r       postgres    false            �            1259    20519    auctions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auctions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.auctions_id_seq;
       public               postgres    false    224            �           0    0    auctions_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.auctions_id_seq OWNED BY public.auctions.id;
          public               postgres    false    223            �            1259    20541    bids    TABLE     �   CREATE TABLE public.bids (
    id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer,
    auction_id integer
);
    DROP TABLE public.bids;
       public         heap r       postgres    false            �            1259    20540    bids_id_seq    SEQUENCE     �   CREATE SEQUENCE public.bids_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.bids_id_seq;
       public               postgres    false    226            �           0    0    bids_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.bids_id_seq OWNED BY public.bids.id;
          public               postgres    false    225            �            1259    20488 
   categories    TABLE     |   CREATE TABLE public.categories (
    id integer NOT NULL,
    description text,
    name character varying(100) NOT NULL
);
    DROP TABLE public.categories;
       public         heap r       postgres    false            �            1259    20487    categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.categories_id_seq;
       public               postgres    false    220            �           0    0    categories_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;
          public               postgres    false    219            �            1259    20499    items    TABLE     �   CREATE TABLE public.items (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    user_id integer,
    category_id integer
);
    DROP TABLE public.items;
       public         heap r       postgres    false            �            1259    20498    items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.items_id_seq;
       public               postgres    false    222            �           0    0    items_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;
          public               postgres    false    221            �            1259    20477    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    nickname character varying(20),
    email character varying(50) NOT NULL,
    phone character varying(20) NOT NULL,
    password text NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    20476    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    218            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    217            8           2604    20523    auctions id    DEFAULT     j   ALTER TABLE ONLY public.auctions ALTER COLUMN id SET DEFAULT nextval('public.auctions_id_seq'::regclass);
 :   ALTER TABLE public.auctions ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    224    224            ;           2604    20544    bids id    DEFAULT     b   ALTER TABLE ONLY public.bids ALTER COLUMN id SET DEFAULT nextval('public.bids_id_seq'::regclass);
 6   ALTER TABLE public.bids ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            6           2604    20491    categories id    DEFAULT     n   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            7           2604    20502    items id    DEFAULT     d   ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);
 7   ALTER TABLE public.items ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            5           2604    20480    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            �          0    20520    auctions 
   TABLE DATA           �   COPY public.auctions (id, desctription, end_time, starting_price, current_price, created_at, updated_at, user_id, item_id) FROM stdin;
    public               postgres    false    224   �8       �          0    20541    bids 
   TABLE DATA           W   COPY public.bids (id, amount, created_at, updated_at, user_id, auction_id) FROM stdin;
    public               postgres    false    226   Y9       �          0    20488 
   categories 
   TABLE DATA           ;   COPY public.categories (id, description, name) FROM stdin;
    public               postgres    false    220   :       �          0    20499    items 
   TABLE DATA           L   COPY public.items (id, name, description, user_id, category_id) FROM stdin;
    public               postgres    false    222   �:       �          0    20477    users 
   TABLE DATA           K   COPY public.users (id, name, nickname, email, phone, password) FROM stdin;
    public               postgres    false    218   J=       �           0    0    auctions_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.auctions_id_seq', 5, true);
          public               postgres    false    223            �           0    0    bids_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.bids_id_seq', 15, true);
          public               postgres    false    225            �           0    0    categories_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.categories_id_seq', 5, true);
          public               postgres    false    219            �           0    0    items_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.items_id_seq', 10, true);
          public               postgres    false    221            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 5, true);
          public               postgres    false    217            I           2606    20529    auctions auctions_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.auctions
    ADD CONSTRAINT auctions_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.auctions DROP CONSTRAINT auctions_pkey;
       public                 postgres    false    224            K           2606    20546    bids bids_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.bids DROP CONSTRAINT bids_pkey;
       public                 postgres    false    226            A           2606    20497    categories categories_name_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);
 H   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_name_key;
       public                 postgres    false    220            C           2606    20495    categories categories_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public                 postgres    false    220            E           2606    20508    items items_name_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_name_key UNIQUE (name);
 >   ALTER TABLE ONLY public.items DROP CONSTRAINT items_name_key;
       public                 postgres    false    222            G           2606    20506    items items_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.items DROP CONSTRAINT items_pkey;
       public                 postgres    false    222            =           2606    20486    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    218            ?           2606    20484    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            N           2606    20535    auctions auctions_item_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.auctions
    ADD CONSTRAINT auctions_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id) ON UPDATE CASCADE ON DELETE SET NULL;
 H   ALTER TABLE ONLY public.auctions DROP CONSTRAINT auctions_item_id_fkey;
       public               postgres    false    222    224    4679            O           2606    20530    auctions auctions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.auctions
    ADD CONSTRAINT auctions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
 H   ALTER TABLE ONLY public.auctions DROP CONSTRAINT auctions_user_id_fkey;
       public               postgres    false    224    218    4671            P           2606    20552    bids bids_auction_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_auction_id_fkey FOREIGN KEY (auction_id) REFERENCES public.auctions(id) ON UPDATE CASCADE ON DELETE SET NULL;
 C   ALTER TABLE ONLY public.bids DROP CONSTRAINT bids_auction_id_fkey;
       public               postgres    false    4681    224    226            Q           2606    20547    bids bids_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
 @   ALTER TABLE ONLY public.bids DROP CONSTRAINT bids_user_id_fkey;
       public               postgres    false    218    226    4671            L           2606    20514    items items_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.items DROP CONSTRAINT items_category_id_fkey;
       public               postgres    false    220    4675    222            M           2606    20509    items items_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
 B   ALTER TABLE ONLY public.items DROP CONSTRAINT items_user_id_fkey;
       public               postgres    false    218    4671    222            �   �   x�����1c�
�qH@�D�
��s��>��;� ��y��7|4�z�)�ԈhY�7m�kv~�N�3�fl�&���(P�0�"z���D��^����k�/�+�B�������j���q��
q�v���|:\�,q{�lV�;Ώ�1����,[�O��d�h)��H`P      �   �   x����AEc�¹��{`kq�u�u&����v�e����~���7�כ��*�
^K(�;I/%籓Ś�1��m)�,bK#q�R��6F
"�rKa�HCס�Q�W"��߇!(
��t��Ƥ*g?���,4�x�Љt&ڵ����!�l���      �   �   x��;n�0Dk�<����M� A�-��%� b�ZR4���;��y3�ޛM%�
9O(c��t�Z]U�7��9]�ic�^H��N,
>Q�0��
4Tj(!R�1	�C8ªђ."�_�չ�<q�W-P��d�p�'[`�hr�-���_j���m�f�#\W�E��%�[��8��A$�PZ���,�qH��nK��f����Gki�      �   B  x����n�0���S��E��˱I�4h�����ȑD��\�0O�!��I��<���Ok�	#{���m"r��ޑ����VC��+p���(�)�y8$����RTg�;V�^2V����R��yP&�]��W;:��y]�T�v'�z3�!��}O����M��$�d����zQ�,{h?h,mx(TCgke�b5��"�'rΎ��v�b~ܝJ���\�<KM;E��h�NMy;�4�>��e����o�� *S�~l%㌵n����5��N���z)uC	/$)����Il��W:����q�r��TG ����	���F^���ER�ɱipH����.b��ީ�#-V�Bt�Q�vvO�q���0���
$~��?9��8;Pˠ���:���H\pJr�g�,��%9�83����u���ֺ}��)��#��:іr�[�P�й���.r�,b�h��.ߓ�ԕz��qz�B�\���,�Q�лL��C��~�v����Α�%a�u�p%Im�W�ʲ�Dz��x,GPҠx�?���AN&�|ڊ�ӏ�Q��M�u��x�      �   2  x�]��n�0����)X&P0`�Q	��Z�R�+vb�h޾nw�|�ω`#�����픁?���"\4���Ѹ����hk`F�>MP��8�oa
g~��w�����;�lT3���:X�V|ȷ���Q��Xڮ�J�qQ@�8�;�!Ǳ��ř/W'�f��d^�m��[�9�Z�ai%7���Z4ʰ�d`��!���*꿹�^ö�ێ��U�Zg�J+n�e�4�I����Կ��(���d��ٶy����0�hT��u)�񝅣�Y��"�+y*'�6S">��k�y�jMw=     