PGDMP  /            	        }            postgres    17.2    17.2 1    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    5    postgres    DATABASE     �   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.utf8';
    DROP DATABASE postgres;
                     postgres    false            �           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                        postgres    false    4850            �            1259    20405    auctions    TABLE     �  CREATE TABLE public.auctions (
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
       public         heap r       postgres    false            �            1259    20404    auctions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.auctions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.auctions_id_seq;
       public               postgres    false    224            �           0    0    auctions_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.auctions_id_seq OWNED BY public.auctions.id;
          public               postgres    false    223            �            1259    20426    bids    TABLE     �   CREATE TABLE public.bids (
    id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer,
    auction_id integer
);
    DROP TABLE public.bids;
       public         heap r       postgres    false            �            1259    20425    bids_id_seq    SEQUENCE     �   CREATE SEQUENCE public.bids_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.bids_id_seq;
       public               postgres    false    226            �           0    0    bids_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.bids_id_seq OWNED BY public.bids.id;
          public               postgres    false    225            �            1259    20373 
   categories    TABLE     |   CREATE TABLE public.categories (
    id integer NOT NULL,
    description text,
    name character varying(100) NOT NULL
);
    DROP TABLE public.categories;
       public         heap r       postgres    false            �            1259    20372    categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.categories_id_seq;
       public               postgres    false    220            �           0    0    categories_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;
          public               postgres    false    219            �            1259    20384    items    TABLE     �   CREATE TABLE public.items (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    user_id integer,
    category_id integer
);
    DROP TABLE public.items;
       public         heap r       postgres    false            �            1259    20383    items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.items_id_seq;
       public               postgres    false    222            �           0    0    items_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;
          public               postgres    false    221            �            1259    20362    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    nickname character varying(20),
    email character varying(50) NOT NULL,
    phone character varying(20) NOT NULL,
    password text NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    20361    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    218            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    217            8           2604    20408    auctions id    DEFAULT     j   ALTER TABLE ONLY public.auctions ALTER COLUMN id SET DEFAULT nextval('public.auctions_id_seq'::regclass);
 :   ALTER TABLE public.auctions ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    224    224            ;           2604    20429    bids id    DEFAULT     b   ALTER TABLE ONLY public.bids ALTER COLUMN id SET DEFAULT nextval('public.bids_id_seq'::regclass);
 6   ALTER TABLE public.bids ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            6           2604    20376    categories id    DEFAULT     n   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            7           2604    20387    items id    DEFAULT     d   ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);
 7   ALTER TABLE public.items ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            5           2604    20365    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            �          0    20405    auctions 
   TABLE DATA           �   COPY public.auctions (id, desctription, end_time, starting_price, current_price, created_at, updated_at, user_id, item_id) FROM stdin;
    public               postgres    false    224   �8       �          0    20426    bids 
   TABLE DATA           W   COPY public.bids (id, amount, created_at, updated_at, user_id, auction_id) FROM stdin;
    public               postgres    false    226   U9       �          0    20373 
   categories 
   TABLE DATA           ;   COPY public.categories (id, description, name) FROM stdin;
    public               postgres    false    220   :       �          0    20384    items 
   TABLE DATA           L   COPY public.items (id, name, description, user_id, category_id) FROM stdin;
    public               postgres    false    222   �:       �          0    20362    users 
   TABLE DATA           K   COPY public.users (id, name, nickname, email, phone, password) FROM stdin;
    public               postgres    false    218   B=       �           0    0    auctions_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.auctions_id_seq', 5, true);
          public               postgres    false    223            �           0    0    bids_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.bids_id_seq', 15, true);
          public               postgres    false    225            �           0    0    categories_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.categories_id_seq', 5, true);
          public               postgres    false    219            �           0    0    items_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.items_id_seq', 10, true);
          public               postgres    false    221            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 5, true);
          public               postgres    false    217            I           2606    20414    auctions auctions_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.auctions
    ADD CONSTRAINT auctions_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.auctions DROP CONSTRAINT auctions_pkey;
       public                 postgres    false    224            K           2606    20431    bids bids_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.bids DROP CONSTRAINT bids_pkey;
       public                 postgres    false    226            A           2606    20382    categories categories_name_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);
 H   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_name_key;
       public                 postgres    false    220            C           2606    20380    categories categories_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public                 postgres    false    220            E           2606    20393    items items_name_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_name_key UNIQUE (name);
 >   ALTER TABLE ONLY public.items DROP CONSTRAINT items_name_key;
       public                 postgres    false    222            G           2606    20391    items items_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.items DROP CONSTRAINT items_pkey;
       public                 postgres    false    222            =           2606    20371    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    218            ?           2606    20369    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            N           2606    20420    auctions auctions_item_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.auctions
    ADD CONSTRAINT auctions_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id) ON UPDATE CASCADE ON DELETE SET NULL;
 H   ALTER TABLE ONLY public.auctions DROP CONSTRAINT auctions_item_id_fkey;
       public               postgres    false    222    224    4679            O           2606    20415    auctions auctions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.auctions
    ADD CONSTRAINT auctions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
 H   ALTER TABLE ONLY public.auctions DROP CONSTRAINT auctions_user_id_fkey;
       public               postgres    false    224    218    4671            P           2606    20437    bids bids_auction_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_auction_id_fkey FOREIGN KEY (auction_id) REFERENCES public.auctions(id) ON UPDATE CASCADE ON DELETE SET NULL;
 C   ALTER TABLE ONLY public.bids DROP CONSTRAINT bids_auction_id_fkey;
       public               postgres    false    4681    224    226            Q           2606    20432    bids bids_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
 @   ALTER TABLE ONLY public.bids DROP CONSTRAINT bids_user_id_fkey;
       public               postgres    false    218    226    4671            L           2606    20399    items items_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.items DROP CONSTRAINT items_category_id_fkey;
       public               postgres    false    220    4675    222            M           2606    20394    items items_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
 B   ALTER TABLE ONLY public.items DROP CONSTRAINT items_user_id_fkey;
       public               postgres    false    218    4671    222            �   �   x��л�0К�B}`��9D&��sDva#M
��#��7�m$G'*��c���+	�ɮeg.�������b�&�t2\4K���8mi���YwM��4ʬ�1��=1t:�Sg��qϖ�P�9���aF[}�������>�)u��U������9p����Z� �_�      �   �   x����C1Ck�"}�s�1��?G�� �l�I�@;M�"S[�ڥ�n��H����`��RPc���E�*yl�X��!{n�yS��"VǙ���t�@9P�T�y��*���g�(c�e���_X�O}�N����]J߂y���\e�����s���      �   �   x��;n1k�<� �s �)�"i�JCS��$�Er��>J���7��-�! Q�0�*6��
�@�h%}��S��t���Cm�x���|�� Y^�>Hy���MK���鋍$�/ k�ud+��o�^�9\���_�e��{0(2-��w��[~Mo���O��jS��]7e�?%��w?Q      �   c  x��S�R�0]�_q?�tH-,I��h;��n���k�6���0_�#'th�h7I��������9�ϑ�8iKk�Cϴ�V;�5�Ӄr���3ǉtm�|�r���t����0��H����]�Fj8J��\-����Z��}Î6��4�}�֎3�]+h
\��M��-��l�H7:�����u�Չ�
�w��X{g'����եD�9P�S�Ϭl�Ӊ��-����&&6�@G���D9B�T�7in�����d0Z��$.��i݋�"��HO�z�b��۫K����u{�Afg�x��(��W���h,*��u�G�q~r�?�$�L��"��To�Nlz���I�5����?O,p3�ޫ�?覌a������*�-ڽ��]��������wL>��������� ��wd%i�H�7�ե���`�(z�<�3qq'����5��?�ق~�2&m���&��b/;$xZ��ch�l��00|�gel[�=Z��v�������;��t@��̓�<�	�-P.7:G$�ى��ra�9���W����X}	 �}-u�3G�}�1�9���F�x�����F&�<�寂w/L�Sbt�I��]UU?�{      �   2  x�U�Ao�0���˧��Жz��↊F�Ò%�J'Uh���>�ܲ�����ó2N��Q�ɶW�^�G������|��
0�I�fHD���v�H7N/�g��s��\��F������Zg��*CȠ�͍'�8g���a�ث�P������Z�0�um���JMmQ*������g��H��߅A �ty�KO��Y�B��X���R��(S+��gkm�,���X G��8��о��������c�ZUj	˟M���\Ks=̺J_�n!S$�@���0�l�{2:N�:�fM�x��}�wL     