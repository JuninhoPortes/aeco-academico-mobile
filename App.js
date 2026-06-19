import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [nomeAluno, setNomeAluno] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [alunos, setAlunos] = useState([]);

  function converterNota(valor) {
    return parseFloat(valor.replace(',', '.'));
  }

  function definirSituacao(media) {
    if (media >= 7) {
      return 'Aprovado';
    }

    if (media >= 5) {
      return 'Recuperação';
    }

    return 'Reprovado';
  }

  function cadastrarAluno() {
    const primeiraNota = converterNota(nota1);
    const segundaNota = converterNota(nota2);

    if (!nomeAluno.trim() || !disciplina.trim()) {
      Alert.alert('Atenção', 'Informe o nome do aluno e a disciplina.');
      return;
    }

    if (
      Number.isNaN(primeiraNota) ||
      Number.isNaN(segundaNota) ||
      primeiraNota < 0 ||
      primeiraNota > 10 ||
      segundaNota < 0 ||
      segundaNota > 10
    ) {
      Alert.alert('Atenção', 'As notas devem ser números entre 0 e 10.');
      return;
    }

    const media = (primeiraNota + segundaNota) / 2;
    const situacao = definirSituacao(media);

    const novoAluno = {
      id: Date.now().toString(),
      nome: nomeAluno.trim(),
      disciplina: disciplina.trim(),
      nota1: primeiraNota.toFixed(1).replace('.', ','),
      nota2: segundaNota.toFixed(1).replace('.', ','),
      media: media.toFixed(1).replace('.', ','),
      situacao,
    };

    setAlunos([novoAluno, ...alunos]);
    limparFormulario();
    Keyboard.dismiss();
  }

  function limparFormulario() {
    setNomeAluno('');
    setDisciplina('');
    setNota1('');
    setNota2('');
  }

  function removerAluno(id) {
    const listaAtualizada = alunos.filter((aluno) => aluno.id !== id);
    setAlunos(listaAtualizada);
  }

  function obterEstiloSituacao(situacao) {
    if (situacao === 'Aprovado') {
      return styles.aprovado;
    }

    if (situacao === 'Recuperação') {
      return styles.recuperacao;
    }

    return styles.reprovado;
  }

  function renderizarAluno({ item }) {
    return (
      <View style={styles.studentCard}>
        <View style={styles.studentHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.nome}</Text>
            <Text style={styles.studentSubject}>{item.disciplina}</Text>
          </View>

          <View style={[styles.statusBadge, obterEstiloSituacao(item.situacao)]}>
            <Text style={styles.statusText}>{item.situacao}</Text>
          </View>
        </View>

        <View style={styles.gradeRow}>
          <Text style={styles.gradeText}>Nota 1: {item.nota1}</Text>
          <Text style={styles.gradeText}>Nota 2: {item.nota2}</Text>
          <Text style={styles.averageText}>Média: {item.media}</Text>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removerAluno(item.id)}
        >
          <Text style={styles.removeButtonText}>Remover registro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>AECO Mobile</Text>
          <Text style={styles.title}>Acadêmico Fácil</Text>
          <Text style={styles.subtitle}>
            Mini sistema acadêmico para registrar alunos, calcular médias e
            acompanhar a situação final.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Novo registro</Text>

          <Text style={styles.label}>Nome do aluno</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: João Silva"
            placeholderTextColor="#94a3b8"
            value={nomeAluno}
            onChangeText={setNomeAluno}
          />

          <Text style={styles.label}>Disciplina</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Programação Mobile"
            placeholderTextColor="#94a3b8"
            value={disciplina}
            onChangeText={setDisciplina}
          />

          <View style={styles.notesContainer}>
            <View style={styles.noteField}>
              <Text style={styles.label}>Nota 1</Text>
              <TextInput
                style={styles.input}
                placeholder="0 a 10"
                placeholderTextColor="#94a3b8"
                keyboardType="decimal-pad"
                value={nota1}
                onChangeText={setNota1}
              />
            </View>

            <View style={styles.noteField}>
              <Text style={styles.label}>Nota 2</Text>
              <TextInput
                style={styles.input}
                placeholder="0 a 10"
                placeholderTextColor="#94a3b8"
                keyboardType="decimal-pad"
                value={nota2}
                onChangeText={setNota2}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={cadastrarAluno}>
            <Text style={styles.primaryButtonText}>Cadastrar e calcular média</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={limparFormulario}>
            <Text style={styles.secondaryButtonText}>Limpar formulário</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Registros acadêmicos</Text>
          <Text style={styles.counter}>{alunos.length} registro(s)</Text>
        </View>

        {alunos.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Nenhum aluno cadastrado até o momento.
            </Text>
          </View>
        ) : (
          <FlatList
            data={alunos}
            keyExtractor={(item) => item.id}
            renderItem={renderizarAluno}
            scrollEnabled={false}
          />
        )}

        <Text style={styles.footer}>
          Projeto desenvolvido com React Native, Expo e EAS Build.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  page: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    padding: 22,
    paddingBottom: 34,
  },
  header: {
    marginBottom: 22,
    marginTop: 8,
  },
  eyebrow: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 10,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 16,
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 18,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 14,
    color: '#0f172a',
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginBottom: 15,
  },
  notesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  noteField: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  secondaryButton: {
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '800',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  counter: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  emptyText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  studentSubject: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  aprovado: {
    backgroundColor: '#dcfce7',
  },
  recuperacao: {
    backgroundColor: '#fef9c3',
  },
  reprovado: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '900',
  },
  gradeRow: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  gradeText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  averageText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '900',
  },
  removeButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
});